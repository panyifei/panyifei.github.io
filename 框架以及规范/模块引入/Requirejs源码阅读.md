# Requirejs源码阅读
接着上文的[学习以及尝试实现](https://github.com/panyifei/learning/blob/master/框架以及规范/模块引入/Requirejs学习以及实现.md),准备好好看下源码的实现。

```
var requirejs, require, define;
(function (global, setTimeout){...}(this ,setTimeout));
```

整体结构就是放出了3个全局的变量，然后在一个匿名函数中对3个变量进行赋值。这里把this和setTimeout传进去应该是历史原因，怕这些东西被改写

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

这里函数执行的比较复杂，我花了一些时间花了一个图：

<img alt="requirejs实现整理" width='800px' src="pics//requirejs.png" />

图里面其实已经画的很详细了

参考：

    http://www.cnblogs.com/yexiaochai/p/3632580.html

    http://www.cnblogs.com/zhiyishou/p/4770013.html

    http://www.nihaoshijie.com.cn/index.php/archives/381
