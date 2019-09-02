---
layout: default
title: Npm模块
---

npm 是 node 的模块网站，模块太多，自己也能使用了一个记录一个

## forever

这个是用来永久运行 nodejs 项目的，类似的还有 pm2，pm2 的展示做的更好一些

## colors

这个是用来在命令行中打个有颜色的 log 用的。语法不少，挺好玩的

## cliff

这个是用来将数据进行格式化的，提供了输出到命令行中的接口，本身依赖了`colors`。

## path-is-absolute

这个是用来判断传入的路径是不是绝对地址的，用来判断当前环境是 windows 还是 linux

## flatiron

这个是用来配置并且创建 app 的，包括浏览器端的 app，包括命令行端的 app，用来作为命令行的 app 生成很好用。

## shush

这个是用来引入包含了注释的 json 的，这样引入的 json 可以包含`//`。

## prettyjson

这个是用来在命令行中输出比较好看的 json 的

## clone

这个是用来复制对象的，实现方式得抽空看一下

## object-assign

这个是用来赋值的，可以将对象的相同属性替换掉，现在作为 es6 的 pollfill 了。

## koa

一个用来搭建 nodejs 项目的框架，拥有众多的中间件。是 express 原班人马编写。升级在于 ES6，以及自由的中间件管理。

## koa-static

koa 中间件，能够将项目的文件作为静态资源放出去，使用的时候要小心，将需要的静态资源放置出去。

我写 analyse(个人模块)的时候，因为将 server 配置在了其他的文件夹下，所以设置的时候得加上\_\_dirname 这种绝对路径。

## koa-router

koa 中间件，是用来进行路由设置的。koa-route 的替代品

## koa-route

koa 中间件，用来管理路由

## knex

nodejs 用来连接数据库的工具，支持的语法很全。

## bookshelf

是基于 knex 开发的连接器，在 knex 之上包装了一层对象的概念，并且在对象之间关联较大时使用起来更方便

## express

一个搭建 nodejs 项目的框架。

todu:clone 的代码看一下
