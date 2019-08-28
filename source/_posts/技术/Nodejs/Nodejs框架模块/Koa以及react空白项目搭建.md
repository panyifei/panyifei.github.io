---
layout: default
title: Koa以及react空白项目搭建
---

这里是自己搭建的一个空白项目框架，使用了 Koa 和 React，使用了 redux。[传送门](https://github.com/panyifei/koa-react-example)

## 前端目录讲解

(前端相关的文件夹是 dist 和 src）

- dist 是存放打包完的文件，包括 css 和 js
- src 是开发过程中的文件，其中包括 css、js、less、prototype 文件夹

css 文件夹—存放如 bootstrap.css

js 文件夹—存放 react+redux 组合的目录及文件

less 文件夹—存放 component less 文件或者 page less 文件

prototype 文件夹—存放 page html 文件（目前已根据 bootstrap 造了一个轮子）

前端开发调试：

     npm install
     gulp dev

gulp dev 会打开根目录的 dev.html 加载打包好的 bundle.min.js ,修改 js 文件夹下的文件时会自动刷新，方便调试

在 prototype 中造轮子时，gulp dev 会编译 less 文件，但需要在 html 中手动刷新。

目前流程已经调通，前端采用 react+redux，demo 是一个简单的计算器。

## 后端目录讲解

后端需要提供的 ajax 都要在 app.js 里面申明一下，然后写在 ajax 目录中，ajax 目录里面处理逻辑并且调用 service 目录里的 service，然后返回结果。我写了个 user 的增删改的例子，大家可以看一下。
