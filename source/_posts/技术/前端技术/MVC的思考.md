---
layout: default
title: MVC的思考
---

一直对于 MVC 这个概念比较模糊，虽然不停地在各种场合听到，但是一直缺乏理解，在勐喆的指导下，终于有了一定的理解，在这里记录下。

## 传统的 MVC

<img alt="MVC" width='500px' src="pics//mvc.png" />

其实传统的 MVC 其实很好理解，我们可以把它当做是一条单向的流动。就是从 input 到 controller 到 model 到 view 再到 output。

但是图中还有两根线，一条从 model 传向 controller，一条是 view 从 controller 拉取这两条线比较让人费解。其实前一条是 model 的变化可能会导致 controller 的行为发生改变。后一条则是 model 与 view 之间的实现方式，这条线其实就是拉模式。一般拉模式其实是比较顺畅的，如果是推模式的话，会存在不确定推多少数据适合的情况。

## MVP

其实在传统中，M 和 C 其实都是后端的，前端只是一个 View 层。但是随着富前端化，V 的功能开始变大。如下图：

<img alt="MVC" width='500px' src="pics//mvp.png" />

V 中的 VC 被独立出来，作为 presenter。VM 和 VV 绑在了一起成为了新的 V。这就是 MVP 模式。

## MVVM

MVVM 其实就是个 MVP 的变种，如下图：

<img alt="MVC" width='500px' src="pics//mvvm.png" />

MVVM 是 VC 和 VM 绑在了一起，VV 只起到了一个简单的 V 功能。很多人觉得 MVVM 和 MVP 的区别在于 MVVM 中 V 和 M 是通过 VM 相互同步的，而 MVP 中虽然也是通过 V 同步，但是 MVVM 是所谓的自动的。但是其实这只是他们之间很小的区别。他们真正的区别应该是 VM 到底与哪个靠的更近一些。

## Angular 属于哪种？

Angular 的作者号称他是 MVVM，但是其实 Angular 只是一个 VMM，他并没有 M 层。他的 VC 与 VM 之间更贴近，并且恰巧也提供了所谓的双向绑定的功能。

## React 属于什么？

React 的官方文档说他是 V 层，这一点是对的，如果问他到底是属于 MVC 还是 MVP 还是 MVVM，答案其实是他并不是任何一个。

我们写 Component 的时候，如果单独抽出一个 Presenter 来管理组件之间的状态，那就是 MVP。如果所有的逻辑写在组件内部，让 VC 和 VM 贴的更近，那就是 MVVM。当然了，其实上述的 MVP 和 MVVM 都并不真正包含 M 层。如果想要一个 M 层，其实得通过接入 redux 或者 flux 之类的来作为数据库。

## 双向绑定算啥

其实这就是个很小的功能。现在的框架其实都是双向绑定的，VM 到 VV 的那层绑定其实都是有的。只不过 Angular 需要你绑在\$scope 上，React 需要你手动写一遍 setState(真正内部的改变框架其实都实现了)。React 也提供了所谓的双向绑定插件，其实内部就是封装了 setState 这一个方法而已。所以双向绑定其实是很小的功能。
