---
layout: default
title: {{ site.name }}
---
# React源码阅读
用了React也有一段时间了，文档什么的也算挺熟悉了，但是内部还是一个黑盒，于是想花点时间尝试看一看里面的世界。

React的代码很庞大，刚打开时简直崩了，仔细看了看发现只需要看一个src文件夹就好了。

一句句的看肯定可能性不大，先把自己在意的几处的代码研究一下。

## React的component是如何创建并渲染的
首先React本身返回了一个React对象。这个对象拥有着createElement方法。

## React的事件系统听说用了享元模式？
