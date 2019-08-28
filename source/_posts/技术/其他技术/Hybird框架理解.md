---
layout: default
title: Hybird理解
---

# Hybird 理解

## 好处

- 只用开发一套代码，安卓，ios 都能够跑
- ios 的审核时间过长，而且一旦发版，基本无法修改了

## 坏处

- 损坏了一定的用户体验
- h5 页面用户如果长期使用对于内存的占有率很高，耗起电来更快

## 点评的 Hybird 现况

app 已经实现了 urlschema 化

通过 urlschema 来给 js 提供更多的 api

建一个隐藏的 iframe 将消息从 html 发出去

native 拦截下来，然后通过 ios 通过 jscall 来做
