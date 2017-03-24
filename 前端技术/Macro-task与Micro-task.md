---
layout: default
title: {{ site.name }}
---
# macro-task与micro-task
在挂起任务时，JS 引擎会将所有任务按照类别分到这两个队列中，首先在 macrotask 的队列（这个队列也被叫做 task queue）中取出第一个任务，执行完毕后取出 microtask 队列中的所有任务顺序执行；之后再取 macrotask 任务，周而复始，直至两个队列的任务都取完。

## 具体分类
macro-task: script（整体代码）, setTimeout, setInterval, setImmediate, I/O, UI rendering
micro-task: process.nextTick, Promises（这里指浏览器实现的原生 Promise）, Object.observe, MutationObserver

http://wengeezhang.com/?p=11

http://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context


tudo:重新好好理解下
