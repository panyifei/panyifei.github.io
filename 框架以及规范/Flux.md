---
layout: default
title: {{ site.name }}
---
# Flux
## Flux文档阅读
Flux是Facebook用来构建客户端应用的应用的构建形式。它通过一个单向的数据流来帮助管理React的展示组件。他是一个模式，而不是一个框架。你可以立刻很容易的使用Flux而不用写很多代码。

Flux的应用有主要的三个部分。

 - dispather
 - store
 - view(React Component)

我们要将这个与MVC区分开，Controller在Flux中确实存在，不过是以controller-views的形式。View通常在顶部，从整个store取出数据并且传给children。另外，action的创造者-dispatcher帮助方法-用来描绘应用中所有可能改变的API。他作为Flux更新环中的第四部分。

Flux用一个单项的数据流来避开了MVC。当用户与一个react的view交互的时候，这个view通过一个中心的dispatcher传递这个action。传给了各种各样的包含了用户数据与逻辑的stores。这个尤其适合react的申明式的语法，即他的更新不需要我们告诉view如何去转换显示。

最开始设计是为了正确的取出数据。比如在页面我们需要展示未读的数量以及未读的列表，我们在更新一个为已读的时候，我们就需要更改两个地方。导致了错综复杂的数据流动以及不可预期的结果。所以我们让store来控制，来接受更新并在合适的时机处理。

### Structure and Data Flow
在Flux应用中，数据流是单向的，从action-dispatcher-store-view，然后view产生了一个新的action-dispatcher-store-view。

所有的数据都通过中枢dispatcher来流动。action大部分情况下是由用户与view交互来创建的。dispatcher触发store注册的callback。Controller-views来根据store的更改变更自己的状态，就像setState方法。

我们来看下Flux的各个部分。

### A Single Dispatcher
dispatcher是一个中间的集线器管理着flux应用中所有的数据流向。他本质上是store的注册的callback。自己本身没有任何的能力。他是来向store分发action的机器。

当应用变大的时候，dispatcher更加重要。他能够根据注册的执行顺序来管理store之间的依赖。store可以被申明等待其他的store更新完了，再更新他自己。

facebook使用的flux可以在npm，bower，github上获取。

//tudo

http://reactjs.cn/react/docs/flux-overview.html

http://facebook.github.io/flux/docs/overview.html
