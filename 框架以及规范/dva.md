---
layout: default
title: {{ site.name }}
---
# dvajs
dvajs是支付宝前端的一层架构，是基于redux，redux-saga，react-router的一层前端框架。

## 特点
 - 简单易学：只有6个api，对于redux用户友好
 - 通过reducers，effects和全局订阅来管理model
 - 跨平台的，支持mobile和react-native
 - 支持组件热替换
 - 支持动态加载model和routes
 - 提供了组件系统
 - 支持TS


差不多知道是个什么东西了，就是个支持namespace的轻型框架嘛，使用的时候connect之后就可以根据namespace发起action了。
