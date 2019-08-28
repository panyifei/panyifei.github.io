---
layout: default
title: this
---

## Proxy 的 this 改变

Proxy 里的 this 改变，被代理的情况下，目标对象内部的 this 关键字会被指向 Proxy 代理。这个情况还是挺严重的，因为目标对象里面有 this 的基本上都没有按照预定行为执行的可能了。
