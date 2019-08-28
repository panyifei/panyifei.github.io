---
layout: default
title: \{#\{ site.name \}#\}
---
# Redux-saga文档
其实网上有中文文档，自己一边看顺便自己翻译一下，加深记忆。

是为了让一些边界影响(例如数据获取或者一些不纯净的事情，例如接触浏览器缓存)在react，redux系统中更加简单。

主要的模型是saga就像是你应用的单独的线程来为这些边界影响负责。他是一个redux的中间件，意味着这个线程可以开始，暂停，取消从主app返回来的正常的redux action，他可以访问完整的redux状态，并且他也可以触发redux的action。

它使用了ES6的模式generator来让这些异步流更可读，可写，可测试。通过这样做，这些异步流看起来像是同步的js代码。就像是async/await，但是generator拥有更多的特性。并不是很能理解，毕竟async内置了执行器。与redux-thunk最开始其实是同一种东西。

这里举了个takeEvery和takeLatest的区别，前面的是每个都会触发，后面的是如果已经有pending的时候，来了action，那只执行最近的。

// 怎么做到的cancel？怎么知道pending状态的，难道存了吗？

## 介绍
### 开始的指导
demo很简单，就是引出了一个effect的概念，这里是put，effect的是简单的js对象包含了中间件来完成的指令，saga会暂停下等到effect完成。

如果有多个saga的话，需要一次把他们启动，就是yield []一下。

// 去找下kop里面

## 基本概念
这里先介绍了下takeEvery和takeLatest，上面描述过了。

然后Saga是用generator实现的，我们可以把effect当做是对中间件的指令来执行一些操作（执行一些异步的方法或是对store分发一个action）。

这里就是介绍了call方法，他也是一个简单的对象描述调用方法，，这样子的好处是容易测试了。

call和apply都是返回的promise的，如果是nodejs风格的方法，使用cps。

### 向store发起action
我们可以直接把dispatch方法传给generator方法，然后我们就可以在获取完数据之后直接触发这个dispatch。但是这样子还是没法测试，于是这里就提出了put这个方法，

### 错误处理
我们当然可以在saga里面使用try catch来抓住错误，但是因为我们yield执行的就是异步的方法，就是一个promise，我们可以直接在请求的时候包装then的时候返回的对象以及catch的时候返回的对象，然后就可以不写try catch了。

### 一个通用的抽象：effect
概括来说，我们通过从Saga内部yield一些申明的效果来实现一个边界影响。你也可以直接yield Promise，但是这样会让测试更难。

saga实际上做的事情其实是在实现预期的控制流的时候将这些effect组合在一起。与redux-thunk相比，redux-saga提供了更多的功能，让我们在表达复杂控制流的时候依旧有同样的测试能力。

## 先进的概念
在这块，我们开始深入库提供的更强大的effects。

### 拉取未来的action
到目前为止我们使用了takeEvery这个帮助的helper来在每个到来的action的时候发起task。这节介绍了take，可以通过允许行动观察过程的完全控制来构建复杂的控制流。

我们直接使用的takeEvery可以用while(true)的方式来用take重写。

主要是使用takeEvery我们无法控制任务何时被调用，也无法控制何时停止监听，比较像是推模式，而使用take比较像是拉模式。我们可以选择监听几次事件之后执行其他的事件，我们还可以限制顺序，比如登录登出，这两个操作，肯定是有先后顺序的，我们如果使用takeEvery他们就分隔在了两个地方，如果用take，就可以强行加了顺序的概念。

### 无阻塞调用
前面的章节，看到了effect如何在一个中心位置控制流，回顾之前的登入登出逻辑，这里尝试完善他。这里的逻辑写的很有意思。

```javascript
function * login() {
  while(true){
    const { user, password } = yield take('LOGIN');
    const token = yield call(loginFun, user, password);
    if (token) {
      yield call(Api.storeItem, {token});
      yield take('LOGOUT');
      yield call(Api.clearItem, 'token');
    }
  }
}
```
监听登录，然后执行登录，有结果的话等待执行登出，执行登出了之后，继续等待登录，666~

但是问题是在执行LOGIN的过程中，如果用户点击了LOGOUT，，就无法执行了，这个之后LOGIN执行完成，回来的时候就触发了问题了。

所以我们不能使用call，因为call是一个会阻塞的effect，我们为了无阻塞调用，只能使用fock。但是使用了fock就无法得到token。然后用take来并发监听两个事件。

然后我们在login的过程中如果点击了logout，我们就得要cancel掉之前的task。这个cancel掉的错误我们可以在try catch中捕获到，然后判断isCancelError来判断是不是被取消的。

### 并行执行任务
yield语法可以用一个简单的线性的风格来写一部的控制流。但是有的时候我们想要同步的完成一件事。我们不能简单的写成顺序型的。

因为后一个yield的call会在前一个执行完了才会触发，所以我们可以用yield []的方式来写。这个时候generator会被阻塞到所有的effects执行完毕，或者当一个effect被拒绝，就像是Promise.all的行为。

### 多个effect之间启动race
有的时候我们开始了多个并行的任务，但是并不想要等所有的结果，我们只想要得到第一个，就有个race方法，他的一个用处在于他会自动取消失败的effect，我们可以通过触发race的其他的effect来停掉其他的effect。

### 通过yield*对Sagas排序
所有的sagas都是可迭代的对象，我们正常都是yield一件事情，我们可以yield * 后面跟上一个可迭代的generator(也就是一个saga)，这样子这个saga的所有的yield都会被抛出来。

### 组合Sagas
直接使用yield * 可以解决问题，但是有些问题，首选是不能单独的测试了，如果想要测试某个generator的话，会有些重复的开销，更重要的问题是，yield * 只允许顺序的组合，一次只能yield * 一个generator。所以解决方法就是yield一个call至generator，然后就会等待generator处理结束了，这样我们就可以通过 yield [call(),call()]来并行执行多个saga了。

//是不是意味着effect.call后面不仅仅可以带一个promise，也可以带一个generator咯？

### 任务取消
我们在上面的无阻塞模块调用已经看到了一个cancel的例子，这里会进行回顾。

当一个任务被fork了之后，我们就可以通过cancel来中止执行了。

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

上面这个例子很好玩，在开始被触发后，等待结束的事件，得到通知后，cancel掉事件，事件就会执行进finally里面，然后就可以使用yield cancelled来检查是否被取消了。

取消一个运行中的task会把影响到的call都给cancel了。

  注意cancel了之后不会等待取消的完成，cancel和fork的行为很类似，一旦发起，就会尽快执行，尽快返回。

#### 自动取消
除了我们手动取消，还有一些情况是自动触发的，在race的时候，除了最先完成的，其他的都会被取消。

并行的effect一旦其中的任务被拒绝，并行的effect都会被拒绝。就是Promise.race了。

### saga的fork模型
在saga中，你可以使用两种effects来动态的fork任务，然后在后台执行。

 - fork：用来创建附属的fork
 - spawn：用来创建分离的fork

一个saga只有在自己结束并且所有附属的fork结束的时候才会结束。就是说fork虽然不是阻断性的，但是还是会等fork结束，他的包裹的saga才会结束。

这种fork的写法和上面的平行运行的写法的效果是一样的。

#### 错误传播
平行运行的写法，如果没有catch错误的话，他会把其他平行的中止掉。同样的，fork也是。我们可以catch住阻断式的call，而fork这种非阻断式的无法被catch住，我们只能在fork的错误向上抛出的时候抓住他。

#### 取消
取消saga意味着取消主要的任务，也会取消所有附属的forks。

#### 分离的fork
分离的fork活在他们自己的执行环境中，parent不会等待分离的fork停止，错误也不会冒泡出去，cancel parent也不会取消附属的fork。

### 常见的并发模式
之前，我们看到了使用takeEvery和takeLatest来管理effect之间的并发性问题。在此章节，我们会看到如何用底层的effect来实现这些帮助函数。

其实很简单，就是takeEvery的时候不停的fork就行了，而takeLatest就是当fork到的时候，cancel掉之前的，然后再fork一份。

### 使用channel
我们可以使用channel来缓存发起的action，比如一次性发起了4个，但是我们想一个个执行，就可以使用channel来管理，就可以让他阻断式的，顺序执行。还可以用来设置一个连接池的概念，只起3个fork，执行完了，从channel中拿取。就是列队的概念。

### 方法
内置了throttle，使用delay可以模拟debounce，我们还可以通过包装saga来实现失败了之后的重复调用，

## 总结
saga的异步管理太强大了，可以几乎处理好全部的事件流。
