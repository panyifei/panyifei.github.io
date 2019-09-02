---
layout: default
title: React源码阅读
---

用了 React 也有一段时间了，文档什么的也算挺熟悉了，但是内部还是一个黑盒，于是想花点时间尝试看一看里面的世界。

React 的代码很庞大，刚打开时简直崩了，仔细看了看发现只需要看一个 src 文件夹就好了。

一句句的看肯定可能性不大，先把自己在意的几处的代码研究一下。

## codebase-overview

react 用的内部模块系统'Haste'，与 commonjs 很像，但是他比较喜欢用独一无二的名字来进行引用。不像 Commonjs 总是用相对路径来引入。目前的代码还是 Haste 风格的，后面可能会在一段时间后改成 Commonjs 的规范。

为了避免出现一些相互的引用，每个文件只能引用自己文件夹内部的。如果两个文件夹内部有公共的地方的话，我们就新建一个 shared 目录来保存。

代码里面会有一些 warning 和 Invariants 来报错。

现在代码里面引入了 Flow 来进行类型的限制了。

### 动态注入

React 用了一些动态注入，主要原因是 React 原来是只支持 DOM 的。后来 Reactive Native 开始作为 React 的一个 fork 了。所以需要添加一些动态注入来让 Reactive Native 重写一些行为。(inject)未来准备抛弃动态注入，在构建时连接所有的静态。

与 render 的相关在 renderers 里面。

### Reconcilers

不同的 renderer 例如 React Dom 以及 React Native 需要分享许多的逻辑，所以 Reconcilers 来管理 render，用户组件，状态，生命周期方法等等跨平台的。

stack reconciler 他管理了所有的 React 组件的内部实例的独立的树结构。

## React 的 component 是如何创建并渲染的

首先 React 本身返回了一个 React 对象。这个对象拥有着 createElement 方法。

## React 的事件系统听说用了享元模式？

先看下官网推荐的 video 讲解：

- EventConstents：列举了所有的监听的事件
- SimpleEventPlugin：就是用来监听浏览器的事件触发，然后执行在组件内部申明的事件。就是都是通过 plugin 来处理事件的；他的事件系统目前都是支持冒泡和捕获的，但是后期可能会删去捕获，因为复杂性，而且也很少人使用。这里的每个事件在最后都会作为 dependences 绑上一个 toplevel 事件。
- ReactBrowserEventEmitter：这个文件就是执行了一个 listenTo 的方法，其实就是监听在 document 上。里面会查看刚才定义的 dependences。然后去定义一些真正被监听的东西。然后就会交给 EventListener 来注册事件(这个东西很难找，因为这个不在 react 的源码里面，在 fbjs 里面)。
- 然后就会执行 dispatchEvent(就是你的浏览器事件被触发的时候真正被执行的第一个方法)。然后就会执行到里面的 handleTopLevelImpl(会去得到那个 event.target，然后拿到他真实的内部的 React 实例)。然后就会执行另一个函数\_handleTopLevel(这个值一般是动态注入的，但是一般都是 ReactEventEmitterMixin 里面的 handleTopLevel)，然后就会得到 EventPluginHub 的 extrqctEvents(基本上就会执行到 SimpleEventPlugin 的 extractEvents，执行 runEventQueueInBatch。
- SimpleEventPlugin 的 extractEvents：这里面就是生成最后的 event 事件，然后通过一个 getPool 来得到(这里就是传说中的享元模式了，慢慢研究一下)
  - SyntheticMouseEvent：我们 map native event to SyntheticEvent。一般的属性都是直接拷贝的，有些特殊的属性需要兼容各种浏览器。
- EventPropagators.accumulateTwoPhaseDispatches：就是处理了 capture 和 bubble 两种事件，这里连有个数组的调用。最后执行的是 EventPluginUtils.traverseTwoPhase(真正开始执行上下的冒泡的地方)。
- 然后执行到 accumulateDirectionalDispatches，里面会查看这个 react code 有没有注册 listener。
- 执行到了 executeDispatchesAndRelease(就是按顺序执行，如果不需要持久化的话，就直接 release)
  - executeDispatchesInOrder：就是真正执行用户定义的事件的地方，会检查用户时候阻止
  - ReactErrorUtils.invokeGuardedCallback：如果有 error 发生的时候，开发模式 react 会创建一个 eventListener 来让浏览器触发他的报错事件，就不会导致整体的挂掉了，非开发模式就会报错

### 事件的整体总结

就是 react 自己通过承接浏览器的事件发生，然后在自己内部的实例进行冒泡和捕获。事件用了个池子来减少每次申明的代价。

### React 的事件是什么时候绑上去的？

React 的 component 其实就是一堆属性。

真正的入口是 ReactDOM.render 开始执行

然后实际上执行的是 ReactMount.render(如果之前 render 过，就会执行更新)

然后执行 ReactMount.\_renderSubtreeIntoContainer

- 参数校验以及报 err 和 warning
- 拿 parentComponent(第一次肯定是 null)
- 拿 prevComponent，第一次为 null
  - 判断是否需要 update，需要的话执行\_updateRootComponent，然后 return；不需要的话执行 unmountComponentAtNode?第一次肯定是 false
  - 执行 unmountComponentAtNode，卸载 container 里面的 render 的组件。
- 然后直接执行\_renderNewRootComponent
  - 执行了 ensureScrollValueMonitoring？
  - 将 element 交给 instantiateReactComponent(提供一个 ReactNode，创建一个真实被 mount 的实例)
  - 然后执行 batchedUpdates，将 willMount 和 didMount 的事件绑上去
  - 然后执行 batchedMountComponentIntoNode
    - 也是从池子里面取出 transaction
  - 然后执行 mountComponentIntoNode(mount component，然后把他插进 DOM 中)
    - 执行了 ReactReconciler.mountComponent (这一步生成了`虚拟DOM`)
    - 其实就是循环调用了 ReactDomComponent.mountComponent
      - 然后主要是调用了\_updateDOMProperties
        - 然后调用了 enqueuePutListener
          - 然后执行了 listenTo(这是真实的监听了)
  - 然后执行了\_mountImageIntoNode(真实的插入了进去)
    - 执行了 DOMLazyTree.insertTreeBefore，将 DOM 树直接插入了进去

## props 有没有做 freeze 的限制？

真的被 freeze 了

## 享元模式的池子是怎么实现的

他的池子的[代码](https://github.com/facebook/react/blob/master/src/shared/utils/PooledClass.js)，

很简单，其实就是创建了一个空数组，然后创建的时候，空的话就新建，非空则 pop。然后 release 的时候，如果池子没装满，就 push 进池子，否则不管他。

这里为了写个通用的不依赖于 arguments，还写了多个 arguments 的情况。

代码其实很简单，不过思路还是挺有意思的。

## React 的所谓双向绑定

React 是单向的数据流，从 owner 流向 child。一般进行 input 的修改我们可以监听 change 方法来 setState。他提供的其实就是简单的把这个步骤由框架来提供了而已。而且那个 mixin 在 0.15 版本已经被废弃了

## React 的 diff 算法

传统 diff 是 O(n3)，React 把他做到了 O(n)。

diff 算法：如果两种 Dom element 不同，就完全重建。如果相同种类，就更改属性。

Component 同样的，react 更新他的 props，并且调用 componentWillReceiveProps 和 componentWillUpdate 两个方法。然后 render 方法调用，使用 diff 算法来把老的变成新的。

默认情况下，react 是会把两个 children 按顺序比较，然后当有不同的时候进行更新。如果我们设置了 key，就会计较聪明，可以进行移动和插入，就会有下面的算法：

    对比新列和老列，从新列的第一个开始比较。设一个lastIndex为老列中的位置和当前位置的最大值。然后比这个值小的话，就需要进行move的操作，比这个值大的就不移动。当然老列中的index每次都要更新。然后不断遍历下去就好了。lastIndex确定了一个安全的位置，左侧的移动不会影响到右侧。
