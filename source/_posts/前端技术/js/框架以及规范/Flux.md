---
layout: default
title: Flux
---

## Flux 文档阅读

Flux 是 Facebook 用来构建客户端应用的应用的构建形式。它通过一个单向的数据流来帮助管理 React 的展示组件。他是一个模式，而不是一个框架。你可以立刻很容易的使用 Flux 而不用写很多代码。

Flux 的应用有主要的三个部分。

- dispather
- store
- view(React Component)

我们要将这个与 MVC 区分开，Controller 在 Flux 中确实存在，不过是以 controller-views 的形式。View 通常在顶部，从整个 store 取出数据并且传给 children。另外，action 的创造者-dispatcher 帮助方法-用来描绘应用中所有可能改变的 API。他作为 Flux 更新环中的第四部分。

Flux 用一个单项的数据流来避开了 MVC。当用户与一个 react 的 view 交互的时候，这个 view 通过一个中心的 dispatcher 传递这个 action。传给了各种各样的包含了用户数据与逻辑的 stores。这个尤其适合 react 的申明式的语法，即他的更新不需要我们告诉 view 如何去转换显示。

最开始设计是为了正确的取出数据。比如在页面我们需要展示未读的数量以及未读的列表，我们在更新一个为已读的时候，我们就需要更改两个地方。导致了错综复杂的数据流动以及不可预期的结果。所以我们让 store 来控制，来接受更新并在合适的时机处理。

### Structure and Data Flow

在 Flux 应用中，数据流是单向的，从 action-dispatcher-store-view，然后 view 产生了一个新的 action-dispatcher-store-view。

所有的数据都通过中枢 dispatcher 来流动。action 大部分情况下是由用户与 view 交互来创建的。dispatcher 触发 store 注册的 callback。Controller-views 来根据 store 的更改变更自己的状态，就像 setState 方法。

我们来看下 Flux 的各个部分。

### A Single Dispatcher

dispatcher 是一个中间的集线器管理着 flux 应用中所有的数据流向。他本质上是 store 的注册的 callback。自己本身没有任何的能力。他是来向 store 分发 action 的机器。

当应用变大的时候，dispatcher 更加重要。他能够根据注册的执行顺序来管理 store 之间的依赖。store 可以被申明等待其他的 store 更新完了，再更新他自己。

facebook 使用的 flux 可以在 npm，bower，github 上获取。

//tudo

http://reactjs.cn/react/docs/flux-overview.html

http://facebook.github.io/flux/docs/overview.html
