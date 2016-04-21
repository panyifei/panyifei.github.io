# Requirejs源码阅读
接着上文的[学习以及尝试实现](https://github.com/panyifei/learning/blob/master/框架以及规范/模块引入/Requirejs学习以及实现.md),准备好好看下源码的实现。

```
var requirejs, require, define;
(function (global, setTimeout){...}(this ,setTimeout));
```

整体结构就是放出了3个全局的变量，然后在一个匿名函数中对3个变量进行赋值。不过这里为什么会把this和setTimeout传进去？

然互看匿名函数的整体的结构：

 - 最先申明了一些简写以及使用到的正则以及浏览器属性的判断。
 - 然后申明了一些简单的辅助方法，包括一些循环，还有对象的检测。
 - 然后是一个主要的方法newContext。这个很长，慢慢看。
 - 然后申明了require方法
 - 然后调用了req({});进行了最初的初始化
 - 然后遍历拿到script，来得到data-main的入口，与我的写法一样
 - 然后申明了define方法
 - 然后再执行了一次req(cfg);用配置好的cfg

## 执行的主要流程
主要是就是执行了一次req({});然后初始化了cfg，然后再执行了一次req(cfg)。

### 执行req({})
第一次执行req({}),其实主要就是初始化了context，主要代码是执行了下面的代码

```javascript
    if (!context) {
        context = contexts[contextName] = req.s.newContext(contextName);
    }
    return context.require(deps, callback, errback);
```

newContext的代码很长，声明好了所有要用到的方法：

  - 首先是声明了一堆内部的对象
  - 然后申明了一些方法，包括处理路径的，移除script标签的，处理异常的，加载的，还初始化了一个内部的handler
  - 然后是一个Module构造函数，通过原型链继承了一些模块的方法
  - 然互把context初始化了一下，几乎就是把所有的东西挂到了context上面，`context.require = context.makeRequire();`
  - 然后把context返回了回来

然后执行的那句context.require，实际上是makeRequire，是一个闭包localRequire

我们来看下localRequire，这方法因为是第一次执行，很多实际上都没什么价值，intakeDefines回去抓取包，但是现在deps是[]，所以没有价值。

### 初始化了cfg
然后就是初始化cfg，主要是得到data-main的入口，以及baseUrl，这里和我上篇文章写法很类似，就不细讲了，就是倒序遍历了下script，得到attribute“data-main”，然后设置到了cfg上而已。

### 再执行了一次req(cfg)
然后再执行一次req(cfg):

```javascript
    if (config) {
        context.configure(config);
    }
    return context.require(deps, callback, errback);
```

这里的configure其实干了很多事情，但是我们简单使用的话，基本是不会触发的，所以主要的还是执行了localRequire

主要是在nextTick中进行了模块的初始化：

```javascript
  context.nextTick(function () {
      //Some defines could have been added since the
      //require call, collect them.
      intakeDefines();
      requireMod = getModule(makeModuleMap(null, relMap));
      //Store if map config should be applied to this require
      //call for dependencies.
      requireMod.skipMap = options.skipMap;
      requireMod.init(deps, callback, errback, {
          enabled: true
      });
      checkLoaded();
  });
```

getModule是得到了得到了context.module的实例，然后调用了init方法来传入依赖。

然后依次执行了enable--check--fetch--load--req.load，然后才真正的在页面中插入DOM了，然后给load方法绑定了onScriptLoad。然后调用了completeLoad方法。

重看，一步步看！！

//硬看代码太难受了，先看些别的




参考：

    http://www.cnblogs.com/yexiaochai/p/3632580.html

    http://www.nihaoshijie.com.cn/index.php/archives/381
