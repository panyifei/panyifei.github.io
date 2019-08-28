---
layout: default
title: Redux源码阅读
---

## 直接看别人的讲解了

### combineReducer

其实就是个柯里化的函数(返回函数的函数)，很简单的，传入的是 reducers 的对应的对象，然后返回中，对于 state 的每个 key，执行一下 reducer，只要有被改变的，那就返回新的 state。

### createStore

如果传入的加强器合法，就调用 enhancer(createStore)(reducer, initialState)。

getState 就是最简单的状态返回。

subscribe 就是注册 listeners，在 store.dispatch 的时候调用。

dispatch 就是简单的将闭包内的 state 换成新的 state，然后调用一下注册的 listener，然后将传入的 action 返回。

replaceReducer 就是替换了内部的 reducer，为了有时动态替换自己的 reducer。

然后会在内部调用下 dispatch 的 init。

### combineReducer

简单的一逼，他的返回结果就是正常的 reducer，其实就是对定义好的 key，有自己独自的 reducer，然后对每个调用而已，妈的简单炸了

### bindActionCreators

也是简单的一逼的东西啊，就是把 dispatch 存了一下而已...

### applyMiddleware

这个函数绕的一逼啊，

输入是中间件的列表，返回的是一个函数。

这个函数需要 createStore 作为参数，然后返回一个函数。

这个函数需要 reducer，state，enhancer 作为参数，返回一个 store

这个 store 的其他内容都一样，只有 dispatch 是被包装过的。

dispatch 的包装好神奇

#### chain

chain 是一个函数的数组，里面都是接受 dispatch，然后返回 dispatch 的结果。就是中间件接收了 store 之后的状态。

#### compose

```
function compose (...funcs) {
  return func.reduce((a,b) => (args) => a(b(...args)))
}
```

对于函数进行 reduce，包装成一个函数，然后最外层传入参数执行，妈的，6 到死~

#### 中间件

所以所有的中间件其实都得与`这个结构配合`的，传入 store，然后传入 dispatch，然后返回新的 dispatch。

#### redux-thunk 代码为什么不传 next，而是传了 dispatch

异步的函数啊！！！我去，所以传的是最后的结果。

#### applyMiddleware 为什么不直接接收 store 作为参数

为了不让 store 应用多遍中间件，所以故意这么设计的..

原来 enchaner 除了 applyMiddleware 之外，还是有其他的，比如 redux 的 dev tools。还是挺过瘾的

他的第三个 enchars 其实是有些冗余的，不过为了之前的一个小问题，作者没有去掉这个东西。
