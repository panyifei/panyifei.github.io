---
layout: default
title: {{ site.name }}
---
## nodejs尝试
nodejs本身是单线程的，可以通过cluster来开多个对接tcp端口。

有些同步的状态可能需要累死与mysql的原子级别的改变才能保证正确。

项目通过sourcemap可以将压缩过的js，本地调试还是未压缩过的样子。

通过设置cash的过期时间来进行第一次的缓存。比如改变不大的就设置地长一些。

通过redis或者其他的类似的小型数据库来做第二层的缓存。
