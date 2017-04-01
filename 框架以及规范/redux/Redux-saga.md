---
layout: default
title: {{ site.name }}
---
# Redux-saga
是为了让一些边界影响(例如数据获取或者一些不纯净的事情，例如接触浏览器缓存)在react，redux系统中更加简单。

主要的模型是saga就像是你应用的单独的线程来为这些边界影响负责。他是一个redux的中间件，意味着这个线程可以开始，暂停，取消从主app返回来的正常的redux action，他可以访问完整的redux状态，并且他也可以触发redux的action。

它使用了ES6的模式generator来让这些异步流更可读，可写，可测试。通过这样做，这些异步流看起来像是同步的js代码。就像是async/await，
