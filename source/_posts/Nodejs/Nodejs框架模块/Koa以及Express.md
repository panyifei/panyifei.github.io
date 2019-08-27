---
layout: default
title: Koa,Co以及Express
---

先来讲解下 Express

## Express

Express 是一个 nodejs 的用来搭建 web 应用的框架，使用起来很简单，然后拥有了众多成熟的中间件，项目可以参考我的一个[外卖订餐网](https://github.com/panyifei/restaurant-nodejs-website)

## Koa

Koa 是 Express 原班人马重写的，主要的特点就是小，他把很多东西全部放出来做中间件了，包括路由等等。

它只提供最简单的服务，可以让我们自己用自己写的中间件，当然官方也有一套的。

Koa 还有就是使用了 ES6 的[generator](https://github.com/panyifei/learning/blob/master/ECMAScript6/Generator函数.md)来调整运行的顺序。

Koa 的中间件很多，注意 koa-static 这个会把项目开放出去，使用的时候要只把静态资源放出去。不然风险很大。

### 中间件的运行

koa 的中间件也是通过 app.use 运行的，他是一个 generator 函数，在函数中调用 yield next,会跳转到下一个中间件的执行，执行完成之后会顺着顺序逆流执行一遍所有中间件的 yield next 之后的东西。

注意调用 yield + 一个异步操作的时候，这个异步操作必须写成一个 promise 或者一个 generator，这样 koa 就会使用 co 函数一直调用到这个异步的返回结果，这样在流程中就不用写到 callback 中，可以直接按照同步的来写~~这也是 koa 做的比较叼的地方。
