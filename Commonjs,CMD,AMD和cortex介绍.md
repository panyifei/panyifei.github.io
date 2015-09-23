# Commonjs,CMD,AMD和cortex介绍

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




todo:CMD和seajs还没有研究
todo:seajs和cortex是怎么保证在Domcontentloaded事件的时候发生的？
