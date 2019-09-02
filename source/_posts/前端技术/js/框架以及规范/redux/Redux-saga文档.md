---
layout: default
title: Redux-saga文档
---

其实网上有中文文档，自己一边看顺便自己翻译一下，加深记忆。

是为了让一些边界影响(例如数据获取或者一些不纯净的事情，例如接触浏览器缓存)在 react，redux 系统中更加简单。

主要的模型是 saga 就像是你应用的单独的线程来为这些边界影响负责。他是一个 redux 的中间件，意味着这个线程可以开始，暂停，取消从主 app 返回来的正常的 redux action，他可以访问完整的 redux 状态，并且他也可以触发 redux 的 action。

它使用了 ES6 的模式 generator 来让这些异步流更可读，可写，可测试。通过这样做，这些异步流看起来像是同步的 js 代码。就像是 async/await，但是 generator 拥有更多的特性。并不是很能理解，毕竟 async 内置了执行器。与 redux-thunk 最开始其实是同一种东西。

这里举了个 takeEvery 和 takeLatest 的区别，前面的是每个都会触发，后面的是如果已经有 pending 的时候，来了 action，那只执行最近的。

// 怎么做到的 cancel？怎么知道 pending 状态的，难道存了吗？

## 介绍

### 开始的指导

demo 很简单，就是引出了一个 effect 的概念，这里是 put，effect 的是简单的 js 对象包含了中间件来完成的指令，saga 会暂停下等到 effect 完成。

如果有多个 saga 的话，需要一次把他们启动，就是 yield []一下。

// 去找下 kop 里面

## 基本概念

这里先介绍了下 takeEvery 和 takeLatest，上面描述过了。

然后 Saga 是用 generator 实现的，我们可以把 effect 当做是对中间件的指令来执行一些操作（执行一些异步的方法或是对 store 分发一个 action）。

这里就是介绍了 call 方法，他也是一个简单的对象描述调用方法，，这样子的好处是容易测试了。

call 和 apply 都是返回的 promise 的，如果是 nodejs 风格的方法，使用 cps。

### 向 store 发起 action

我们可以直接把 dispatch 方法传给 generator 方法，然后我们就可以在获取完数据之后直接触发这个 dispatch。但是这样子还是没法测试，于是这里就提出了 put 这个方法，

### 错误处理

我们当然可以在 saga 里面使用 try catch 来抓住错误，但是因为我们 yield 执行的就是异步的方法，就是一个 promise，我们可以直接在请求的时候包装 then 的时候返回的对象以及 catch 的时候返回的对象，然后就可以不写 try catch 了。

### 一个通用的抽象：effect

概括来说，我们通过从 Saga 内部 yield 一些申明的效果来实现一个边界影响。你也可以直接 yield Promise，但是这样会让测试更难。

saga 实际上做的事情其实是在实现预期的控制流的时候将这些 effect 组合在一起。与 redux-thunk 相比，redux-saga 提供了更多的功能，让我们在表达复杂控制流的时候依旧有同样的测试能力。

## 先进的概念

在这块，我们开始深入库提供的更强大的 effects。

### 拉取未来的 action

到目前为止我们使用了 takeEvery 这个帮助的 helper 来在每个到来的 action 的时候发起 task。这节介绍了 take，可以通过允许行动观察过程的完全控制来构建复杂的控制流。

我们直接使用的 takeEvery 可以用 while(true)的方式来用 take 重写。

主要是使用 takeEvery 我们无法控制任务何时被调用，也无法控制何时停止监听，比较像是推模式，而使用 take 比较像是拉模式。我们可以选择监听几次事件之后执行其他的事件，我们还可以限制顺序，比如登录登出，这两个操作，肯定是有先后顺序的，我们如果使用 takeEvery 他们就分隔在了两个地方，如果用 take，就可以强行加了顺序的概念。

### 无阻塞调用

前面的章节，看到了 effect 如何在一个中心位置控制流，回顾之前的登入登出逻辑，这里尝试完善他。这里的逻辑写的很有意思。

```javascript
function* login() {
  while (true) {
    const { user, password } = yield take("LOGIN");
    const token = yield call(loginFun, user, password);
    if (token) {
      yield call(Api.storeItem, { token });
      yield take("LOGOUT");
      yield call(Api.clearItem, "token");
    }
  }
}
```

监听登录，然后执行登录，有结果的话等待执行登出，执行登出了之后，继续等待登录，666~

但是问题是在执行 LOGIN 的过程中，如果用户点击了 LOGOUT，，就无法执行了，这个之后 LOGIN 执行完成，回来的时候就触发了问题了。

所以我们不能使用 call，因为 call 是一个会阻塞的 effect，我们为了无阻塞调用，只能使用 fock。但是使用了 fock 就无法得到 token。然后用 take 来并发监听两个事件。

然后我们在 login 的过程中如果点击了 logout，我们就得要 cancel 掉之前的 task。这个 cancel 掉的错误我们可以在 try catch 中捕获到，然后判断 isCancelError 来判断是不是被取消的。

### 并行执行任务

yield 语法可以用一个简单的线性的风格来写一部的控制流。但是有的时候我们想要同步的完成一件事。我们不能简单的写成顺序型的。

因为后一个 yield 的 call 会在前一个执行完了才会触发，所以我们可以用 yield []的方式来写。这个时候 generator 会被阻塞到所有的 effects 执行完毕，或者当一个 effect 被拒绝，就像是 Promise.all 的行为。

### 多个 effect 之间启动 race

有的时候我们开始了多个并行的任务，但是并不想要等所有的结果，我们只想要得到第一个，就有个 race 方法，他的一个用处在于他会自动取消失败的 effect，我们可以通过触发 race 的其他的 effect 来停掉其他的 effect。

### 通过 yield\*对 Sagas 排序

所有的 sagas 都是可迭代的对象，我们正常都是 yield 一件事情，我们可以 yield \* 后面跟上一个可迭代的 generator(也就是一个 saga)，这样子这个 saga 的所有的 yield 都会被抛出来。

### 组合 Sagas

直接使用 yield _ 可以解决问题，但是有些问题，首选是不能单独的测试了，如果想要测试某个 generator 的话，会有些重复的开销，更重要的问题是，yield _ 只允许顺序的组合，一次只能 yield \* 一个 generator。所以解决方法就是 yield 一个 call 至 generator，然后就会等待 generator 处理结束了，这样我们就可以通过 yield [call(),call()]来并行执行多个 saga 了。

//是不是意味着 effect.call 后面不仅仅可以带一个 promise，也可以带一个 generator 咯？

### 任务取消

我们在上面的无阻塞模块调用已经看到了一个 cancel 的例子，这里会进行回顾。

当一个任务被 fork 了之后，我们就可以通过 cancel 来中止执行了。

```
function* bgSync() {
  try {
    while (true) {
      yield put(actions.requestStart())
      const result = yield call(someApi)
      yield put(actions.requestSuccess(result))
      yield call(delay, 5000)
    }
  } finally {
    if (yield cancelled())
      yield put(actions.requestFailure('Sync cancelled!'))
  }
}
function* main(){
  while (yield take(STRAT)) {
    const bgTask = yield fork(bgSync);
    yield take(STOP);
    yield cancel(bgTask);
  }
}
```

上面这个例子很好玩，在开始被触发后，等待结束的事件，得到通知后，cancel 掉事件，事件就会执行进 finally 里面，然后就可以使用 yield cancelled 来检查是否被取消了。

取消一个运行中的 task 会把影响到的 call 都给 cancel 了。

注意 cancel 了之后不会等待取消的完成，cancel 和 fork 的行为很类似，一旦发起，就会尽快执行，尽快返回。

#### 自动取消

除了我们手动取消，还有一些情况是自动触发的，在 race 的时候，除了最先完成的，其他的都会被取消。

并行的 effect 一旦其中的任务被拒绝，并行的 effect 都会被拒绝。就是 Promise.race 了。

### saga 的 fork 模型

在 saga 中，你可以使用两种 effects 来动态的 fork 任务，然后在后台执行。

- fork：用来创建附属的 fork
- spawn：用来创建分离的 fork

一个 saga 只有在自己结束并且所有附属的 fork 结束的时候才会结束。就是说 fork 虽然不是阻断性的，但是还是会等 fork 结束，他的包裹的 saga 才会结束。

这种 fork 的写法和上面的平行运行的写法的效果是一样的。

#### 错误传播

平行运行的写法，如果没有 catch 错误的话，他会把其他平行的中止掉。同样的，fork 也是。我们可以 catch 住阻断式的 call，而 fork 这种非阻断式的无法被 catch 住，我们只能在 fork 的错误向上抛出的时候抓住他。

#### 取消

取消 saga 意味着取消主要的任务，也会取消所有附属的 forks。

#### 分离的 fork

分离的 fork 活在他们自己的执行环境中，parent 不会等待分离的 fork 停止，错误也不会冒泡出去，cancel parent 也不会取消附属的 fork。

### 常见的并发模式

之前，我们看到了使用 takeEvery 和 takeLatest 来管理 effect 之间的并发性问题。在此章节，我们会看到如何用底层的 effect 来实现这些帮助函数。

其实很简单，就是 takeEvery 的时候不停的 fork 就行了，而 takeLatest 就是当 fork 到的时候，cancel 掉之前的，然后再 fork 一份。

### 使用 channel

我们可以使用 channel 来缓存发起的 action，比如一次性发起了 4 个，但是我们想一个个执行，就可以使用 channel 来管理，就可以让他阻断式的，顺序执行。还可以用来设置一个连接池的概念，只起 3 个 fork，执行完了，从 channel 中拿取。就是列队的概念。

### 方法

内置了 throttle，使用 delay 可以模拟 debounce，我们还可以通过包装 saga 来实现失败了之后的重复调用，

## 总结

saga 的异步管理太强大了，可以几乎处理好全部的事件流。
