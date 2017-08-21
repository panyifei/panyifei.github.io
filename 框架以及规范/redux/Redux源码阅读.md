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

最后返回了getState，
