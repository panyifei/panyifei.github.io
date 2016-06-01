---
layout: default
title: {{ site.name }}
---
# Hybird理解

## 好处

- 只用开发一套代码，安卓，ios都能够跑
- ios的审核时间过长，而且一旦发版，基本无法修改了

## 坏处

- 损坏了一定的用户体验
- h5页面用户如果长期使用对于内存的占有率很高，耗起电来更快

## 点评的Hybird现况
app已经实现了urlschema化

通过urlschema来给js提供更多的api

建一个隐藏的iframe将消息从html发出去

native拦截下来，然后通过ios通过jscall来做
