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
React用了一些动态注入，主要原因是React原来是只支持DOM的。后来Reactive Native开始作为React的一个fork了。所以需要添加一些动态注入来让Reactive Native重写一些行为。

## React的component是如何创建并渲染的
首先React本身返回了一个React对象。这个对象拥有着createElement方法。

## React的事件系统听说用了享元模式？
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
    -         
