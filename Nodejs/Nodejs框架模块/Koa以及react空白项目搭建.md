---
layout: default
title: {{ site.name }}
---
# Koa以及react空白项目搭建
这里是自己搭建的一个空白项目框架，使用了Koa和React，使用了redux。[传送门](https://github.com/panyifei/koa-react-example)

## 前端目录讲解
(前端相关的文件夹是dist和src）

- dist是存放打包完的文件，包括css和js
- src是开发过程中的文件，其中包括css、js、less、prototype文件夹

css文件夹—存放如bootstrap.css

js文件夹—存放react+redux组合的目录及文件

less文件夹—存放component less文件或者page less文件

prototype文件夹—存放page html文件（目前已根据bootstrap造了一个轮子）


前端开发调试：

     npm install
     gulp dev   

gulp dev 会打开根目录的dev.html 加载打包好的bundle.min.js ,修改js文件夹下的文件时会自动刷新，方便调试

在prototype中造轮子时，gulp dev会编译less文件，但需要在html中手动刷新。

目前流程已经调通，前端采用react+redux，demo是一个简单的计算器。

## 后端目录讲解

后端需要提供的ajax都要在app.js里面申明一下，然后写在ajax目录中，ajax目录里面处理逻辑并且调用service目录里的service，然后返回结果。我写了个user的增删改的例子，大家可以看一下。
