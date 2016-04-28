# Commonjs,CMD,AMD和cortex介绍

这里只是一些入门级别的认识，深入一些的可查看我的阅读笔记[模块加载系统][1]

## Commonjs规范

commonjs是服务器模块的规范，**nodejs**实现了规范

- 单独的文件就是一个模块，每个模块拥有自己的作用域；

- 通过`module.exports`来将对象和方法抛出去；

- 通过`require`来引入，就可以访问挂载的对象，并且直接调用变量；

### 每个模块

- 每个都有个module对象，这个对象不是全局变量，而是**本地变量**
- exports  = module.exports，可以放弃使用exports，只使用module.exports



>**CommonJS**就是个**同步加载方案**，因为服务器一般文件都在本地硬盘，所以加载比较快

---

## AMD规范

AMD是异步模块的定义，模块的加载不影响后面的语句，所有的依赖的语句，会被放在一个加载完才执行的回调函数中,AMD推崇`依赖前置`

```
require(['zepto'],function($){
	$('body');
});
```
参考了[阮一峰](http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html)老师的文章

---

##Requirejs
根据AMD实现了异步的加载，并且管理了**模块的依赖性**
简单使用就是去官网下载下，然后data-main指定主入口模块

主模块的代码遵循AMD：

```
require([],function(){})
```
加载的模块的写法：

```
define([],function(){})
```

参考了[阮一峰](http://www.ruanyifeng.com/blog/2012/11/require_js.html)老师的文章

---

## Cortex
[张颖老师](https://github.com/kaelzhang)的[cortex](https://github.com/cortexjs/cortex)，是一个前端解决方案，类似于npm，提供了模块的管理，加载，本地调试。目前用在点评网的所有的前端项目上

###思想
将多余的事情交给框架

让前端工程师注重在业务逻辑上

解决公共模块版本问题

### Tip
- 一个页面可以通过引入多个facade来引入多个项目的前端资源，这样来解耦了页面
- 这些的模块依赖是在服务器端已然直销并且可以拼装出来了，通过一些算法进行合并和修饰
- cortex通过Semver来区别进行版本的管理，来看是否兼容来决定加载几个依赖的，nodejs是只要依赖的就加载，maven是只加载最新的，都不是最优实现
- cortex将静态资源统一加上了版本号来让cdn区分是不是该去拿最新的，当发现要更新时，cdn会与我们的静态服务器进行通信，来拿取。
- 依赖树的信息通过neocortex-4j来吐到页面上，可以并行加载
- combo的好处在于一个请求把所有的数据拉回来，其实就是这个请求打到cdn上，cdn发现没有这个结果，就回源，打到我们的服务器上，我们的服务器就会去拼装js

[1]:https://github.com/panyifei/learning/blob/master/Javascript框架设计/模块加载系统.md
