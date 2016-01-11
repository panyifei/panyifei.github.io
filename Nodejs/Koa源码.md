# Koa源码

继着上文的[Co源码](https://github.com/panyifei/learning/blob/master/Nodejs/Co源码以及与Koa的深入理解.md)，开始学习下Koa是怎么写的。我看的版本是1.1.2的。

## Koa究竟是个啥?
从package.json里面看，Koa的入口是application.js，于是先看这个js。

### application.js
先从最开始引入的一些模块开始理解。

 - debug：最开始引了一个外部的debug模块。这是个好东西，只要在运行的时候使用`DEBUG=..`就可以了进行代码的调试了，如下图，如果有多个的话可以用逗号分隔开。会有比较好看的风格，主要是用来替换console.log的，看上去更专业点。

<img alt="debug使用" width='700px' src="pics//debug.png" />

 - events：然后引用了nodejs的内置模块events，然后做了件奇怪的事情，将application的prototype设置了下，没看懂。。。

tudo：这里最后再回顾。。。

```javascript
Object.setPrototypeOf(Application.prototype, Emitter.prototype);
```
 - composition：外部模块，试验性质。是可以将传入的函数包装成一个promise的。
  - 主要是支持包括es7的async语法的，如果设置了this.experimental，就会使用这个来执行，否则的话使用co.wrap方法。
  - koalization是不是打开了experimental？
 - on-finished：外部模块，是在response结束或者失败的时候触发的，如果失败了的话会带个error进来。
 - response，request，context：3个内部代码块，都是重新对req，res和context进行了封装。
 - koa-compose：外部模块，是个核心方法，将所有的中间件嵌套为循环的genreator，然后就可以交给co去wrap一下变成promise，然后就可以直接执行了。
 - koa-is-json：一个小的外部模块，用来检测body是不是json
 - statuses：外部模块，简单的http状态码的相互对应而已
 - cookies：外部模块，进行cookie的管理
 - accepts：外部模块，用来对请求头的accepts进行管理，处理
 - assert：外部模块，用来写单元测试的
 - stream：内置模块，好像是为了处理一些图片文件做的吗？tudo：再看一下
 - http：内置模块，用来createServer的
 - only：外部模块，用来返回一个新对象，包含只在传入的白名单中的属性
 - co：外部模块，前面已经研究过的模块，不再详细记录，参见[Co](https://github.com/panyifei/learning/blob/master/Nodejs/Co源码以及与Koa的深入理解.md)

至此，使用的模块已经清楚，开始看下整个结构。

Application是被抛出去的总入口，是个`构造函数`，他的作用是

 - 区分传入的环境参数
 - 初始化存使用的中间件middleware，一个空数组。
 - 使用自己的包装过的3个内部代码来初始化上下文，req和res。

app是Application的原型对象。

强行用emitter的原型来替换了application的原型。

然后对app进行原型上的包装。

 - app.listen：来搭建server的
 - toJSON方法没有看懂存在的价值 tudo：再看一下
 - app.use：很清楚，就是往middleware里面push而已
 - app.callback：处理中间件并且进行返回的地方
 - app.createContext：私有方法，创建初始化的上下文
 - app.onerror：私有方法，默认的错误处理
 - respond：用来帮助返回的方法
