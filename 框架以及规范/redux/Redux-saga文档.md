---
layout: default
title: {{ site.name }}
---
# Redux-saga文档
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
