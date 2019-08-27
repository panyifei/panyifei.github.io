---
layout: default
title: nodejs尝试
---

nodejs 本身是单线程的，可以通过 cluster 来开多个对接 tcp 端口。

有些同步的状态可能需要累死与 mysql 的原子级别的改变才能保证正确。

项目通过 sourcemap 可以将压缩过的 js，本地调试还是未压缩过的样子。

通过设置 cash 的过期时间来进行第一次的缓存。比如改变不大的就设置地长一些。

通过 redis 或者其他的类似的小型数据库来做第二层的缓存。
