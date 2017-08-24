---
layout: default
title: {{ site.name }}
---
# Redux源码阅读
## 直接看别人的讲解了
### combineReducer
其实就是个柯里化的函数(返回函数的函数)，很简单的，传入的是reducers的对应的对象，然后返回中，对于state的每个key，执行一下reducer，只要有被改变的，那就返回新的state。

### createStore
如果传入的加强器合法，就调用enhancer(createStore)(reducer, initialState)。

getState就是最简单的状态返回。

subscribe就是注册listeners，在store.dispatch的时候调用。

dispatch就是简单的将闭包内的state换成新的state，然后调用一下注册的listener，然后将传入的action返回。

replaceReducer就是替换了内部的reducer，为了有时动态替换自己的reducer。

然后会在内部调用下dispatch的init。

### combineReducer
简单的一逼，他的返回结果就是正常的reducer，其实就是对定义好的key，有自己独自的reducer，然后对每个调用而已，妈的简单炸了

### bindActionCreators
也是简单的一逼的东西啊，就是把dispatch存了一下而已...

### applyMiddleware
这个函数绕的一逼啊，

输入是中间件的列表，返回的是一个函数。

这个函数需要createStore作为参数，然后返回一个函数。

这个函数需要reducer，state，enhancer作为参数，返回一个store

这个store的其他内容都一样，只有dispatch是被包装过的。

dispatch的包装好神奇

#### chain
chain是一个函数的数组，里面都是接受dispatch，然后返回dispatch的结果。就是中间件接收了store之后的状态。

#### compose
```
function compose (...funcs) {
  return func.reduce((a,b) => (args) => a(b(...args)))
}
```

对于函数进行reduce，包装成一个函数，然后最外层传入参数执行，妈的，6到死~


#### 中间件
所以所有的中间件其实都得与`这个结构配合`的，传入store，然后传入dispatch，然后返回新的dispatch。

#### redux-thunk代码为什么不传next，而是传了dispatch
异步的函数啊！！！我去，所以传的是最后的结果。

#### applyMiddleware为什么不直接接收store作为参数
为了不让store应用多遍中间件，所以故意这么设计的..

原来enchaner除了applyMiddleware之外，还是有其他的，比如redux的dev tools。还是挺过瘾的

他的第三个enchars其实是有些冗余的，不过为了之前的一个小问题，作者没有去掉这个东西。
