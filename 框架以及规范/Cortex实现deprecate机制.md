---
layout: default
title: {{ site.name }}
---
## Cortex
Cortex是张颖张老师实现的一套前端解决方案，前端的模块化的实现是借鉴了npm。目前还未实现deprecate机制。在这里思考下如何实现该机制。

## deprecate
目前的理解是通过deprecate命令来申明放弃某个版本，下次在安装这个东西的时候npm会给个报错的东西

首先命令处得多接受一个参数

registry处得多一个标记位，代表放弃，然后安装的时候，检测标记位，如果为false，给出报错信息
