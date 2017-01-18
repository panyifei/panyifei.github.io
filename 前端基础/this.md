---
layout: default
title: {{ site.name }}
---
# this
## Proxy的this改变
Proxy里的this改变，被代理的情况下，目标对象内部的this关键字会被指向Proxy代理。这个情况还是挺严重的，因为目标对象里面有this的基本上都没有按照预定行为执行的可能了。
