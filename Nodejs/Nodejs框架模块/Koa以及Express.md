# Koa,Co以及Express
先来讲解下Express

## Express
Express是一个nodejs的用来搭建web应用的框架，使用起来很简单，然后拥有了众多成熟的中间件，项目可以参考我的一个[外卖订餐网](https://github.com/panyifei/restaurant-nodejs-website)

## Koa
Koa是Express原班人马重写的，主要的特点就是小，他把很多东西全部放出来做中间件了，包括路由等等。

它只提供最简单的服务，可以让我们自己用自己写的中间件，当然官方也有一套的。

Koa还有就是使用了ES6的[generator](https://github.com/panyifei/learning/blob/master/ECMAScript6/Generator函数.md)来调整运行的顺序。

Koa的中间件很多，注意koa-static这个会把项目开放出去，使用的时候要只把静态资源放出去。不然风险很大。

### 中间件的运行
koa的中间件也是通过app.use运行的，他是一个generator函数，在函数中调用yield next,会跳转到下一个中间件的执行，执行完成之后会顺着顺序逆流执行一遍所有中间件的yield next之后的东西。

注意调用yield + 一个异步操作的时候，这个异步操作必须写成一个promise或者一个generator，这样koa就会使用co函数一直调用到这个异步的返回结果，这样在流程中就不用写到callback中，可以直接按照同步的来写~~这也是koa做的比较叼的地方。
