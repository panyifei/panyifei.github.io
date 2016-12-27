---
layout: default
title: {{ site.name }}
---
# React源码阅读
用了React也有一段时间了，文档什么的也算挺熟悉了，但是内部还是一个黑盒，于是想花点时间尝试看一看里面的世界。

React的代码很庞大，刚打开时简直崩了，仔细看了看发现只需要看一个src文件夹就好了。

一句句的看肯定可能性不大，先把自己在意的几处的代码研究一下。

## codebase-overview
react用的内部模块系统'Haste'，与commonjs很像，但是他比较喜欢用独一无二的名字来进行引用。不像Commonjs总是用相对路径来引入。目前的代码还是Haste风格的，后面可能会在一段时间后改成Commonjs的规范。

为了避免出现一些相互的引用，每个文件只能引用自己文件夹内部的。如果两个文件夹内部有公共的地方的话，我们就新建一个shared目录来保存。

代码里面会有一些warning和Invariants来报错。

现在代码里面引入了Flow来进行类型的限制了。

### 动态注入
React用了一些动态注入，主要原因是React原来是只支持DOM的。后来Reactive Native开始作为React的一个fork了。所以需要添加一些动态注入来让Reactive Native重写一些行为。(inject)未来准备抛弃动态注入，在构建时连接所有的静态。

与render的相关在renderers里面。

### Reconcilers
不同的renderer例如React Dom以及React Native需要分享许多的逻辑，所以Reconcilers来管理render，用户组件，状态，生命周期方法等等跨平台的。

stack reconciler他管理了所有的React组件的内部实例的独立的树结构。

## React的component是如何创建并渲染的
首先React本身返回了一个React对象。这个对象拥有着createElement方法。

## React的事件系统听说用了享元模式？
先看下官网推荐的video讲解：

 - EventConstents：列举了所有的监听的事件
 - SimpleEventPlugin：就是用来监听浏览器的事件触发，然后执行在组件内部申明的事件。就是都是通过plugin来处理事件的；他的事件系统目前都是支持冒泡和捕获的，但是后期可能会删去捕获，因为复杂性，而且也很少人使用。这里的每个事件在最后都会作为dependences绑上一个toplevel事件。
 - ReactBrowserEventEmitter：这个文件就是执行了一个listenTo的方法，其实就是监听在document上。里面会查看刚才定义的dependences。然后去定义一些真正被监听的东西。然后就会交给EventListener来注册事件(这个东西很难找，因为这个不在react的源码里面，在fbjs里面)。
 - 然后就会执行dispatchEvent(就是你的浏览器事件被触发的时候真正被执行的第一个方法)。然后就会执行到里面的handleTopLevelImpl(会去得到那个event.target，然后拿到他真实的内部的React实例)。然后就会执行另一个函数_handleTopLevel(这个值一般是动态注入的，但是一般都是ReactEventEmitterMixin里面的handleTopLevel)，然后就会得到EventPluginHub的extrqctEvents(基本上就会执行到SimpleEventPlugin的extractEvents，执行runEventQueueInBatch。
 - SimpleEventPlugin的extractEvents：这里面就是生成最后的event事件，然后通过一个getPool来得到(这里就是传说中的享元模式了，慢慢研究一下)
    - SyntheticMouseEvent：我们map native event to SyntheticEvent。一般的属性都是直接拷贝的，有些特殊的属性需要兼容各种浏览器。
 - EventPropagators.accumulateTwoPhaseDispatches：就是处理了capture和bubble两种事件，这里连有个数组的调用。最后执行的是EventPluginUtils.traverseTwoPhase(真正开始执行上下的冒泡的地方)。
 - 然后执行到accumulateDirectionalDispatches，里面会查看这个react code有没有注册listener。
 - 执行到了executeDispatchesAndRelease(就是按顺序执行，如果不需要持久化的话，就直接release)
    - executeDispatchesInOrder：就是真正执行用户定义的事件的地方，会检查用户时候阻止
    - ReactErrorUtils.invokeGuardedCallback：如果有error发生的时候，开发模式react会创建一个eventListener来让浏览器触发他的报错事件，就不会导致整体的挂掉了，非开发模式就会报错

### 事件的整体总结
就是react自己通过承接浏览器的事件发生，然后在自己内部的实例进行冒泡和捕获。事件用了个池子来减少每次申明的代价。

### React的事件是什么时候绑上去的？
React的component其实就是一堆属性。

真正的入口是ReactDOM.render开始执行

然后实际上执行的是ReactMount.render(如果之前render过，就会执行更新)

然后执行ReactMount._renderSubtreeIntoContainer

 - 参数校验以及报err和warning
 - 拿parentComponent(第一次肯定是null)
 - 拿prevComponent，第一次为null
    - 判断是否需要update，需要的话执行_updateRootComponent，然后return；不需要的话执行unmountComponentAtNode?第一次肯定是false
    - 执行unmountComponentAtNode，卸载container里面的render的组件。
 - 然后直接执行_renderNewRootComponent
    - 执行了ensureScrollValueMonitoring？
    - 将element交给instantiateReactComponent(提供一个ReactNode，创建一个真实被mount的实例)
    - 然后执行batchedUpdates，将willMount和didMount的事件绑上去  
    - 然后执行batchedMountComponentIntoNode
        - 也是从池子里面取出transaction
    - 然后执行mountComponentIntoNode(mount component，然后把他插进DOM中)
        - 执行了ReactReconciler.mountComponent (这一步生成了`虚拟DOM`)
        - 其实就是循环调用了ReactDomComponent.mountComponent
            - 然后主要是调用了_updateDOMProperties
                - 然后调用了enqueuePutListener
                    - 然后执行了listenTo(这是真实的监听了)
    - 然后执行了_mountImageIntoNode(真实的插入了进去)
        - 执行了DOMLazyTree.insertTreeBefore，将DOM树直接插入了进去

## props有没有做freeze的限制？
真的被freeze了

## 享元模式的池子是怎么实现的
他的池子的[代码](https://github.com/facebook/react/blob/master/src/shared/utils/PooledClass.js)，

很简单，其实就是创建了一个空数组，然后创建的时候，空的话就新建，非空则pop。然后release的时候，如果池子没装满，就push进池子，否则不管他。

这里为了写个通用的不依赖于arguments，还写了多个arguments的情况。

代码其实很简单，不过思路还是挺有意思的。

## React的所谓双向绑定
React是单向的数据流，从owner流向child。一般进行input的修改我们可以监听change方法来setState。他提供的其实就是简单的把这个步骤由框架来提供了而已。而且那个mixin在0.15版本已经被废弃了

## React的diff算法
传统diff是O(n3)，React把他做到了O(n)。

diff算法：如果两种Dom element不同，就完全重建。如果相同种类，就更改属性。

Component同样的，react更新他的props，并且调用componentWillReceiveProps和componentWillUpdate两个方法。然后render方法调用，使用diff算法来把老的变成新的。

默认情况下，react是会把两个children按顺序比较，然后当有不同的时候进行更新。如果我们设置了key，就会计较聪明，可以进行移动和插入，就会有下面的算法：

    对比新列和老列，从新列的第一个开始比较。设一个lastIndex为老列中的位置和当前位置的最大值。然后比这个值小的话，就需要进行move的操作，比这个值大的就不移动。当然老列中的index每次都要更新。然后不断遍历下去就好了。lastIndex确定了一个安全的位置，左侧的移动不会影响到右侧。
