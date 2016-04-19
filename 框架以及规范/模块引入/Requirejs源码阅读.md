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

# 执行的主要流程

参考：

    http://www.cnblogs.com/yexiaochai/p/3632580.html
