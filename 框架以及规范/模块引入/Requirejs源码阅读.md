# Reuqirejs源码阅读
Requirejs是AMD规范的比较好的实践，在看Requirejs之前先看下AMD的规范

## AMD规范
看的是github上的[中文翻译的规范](https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88))。

就是很简单的一个define方法

```javascript
  define(id?, dependencies?, factory);
```

 - id为这个定义的模块的名字，如果不提供，默认为指定的脚本的名字，如果提供了，必须是唯一的
 - 二参为依赖，就是模块需要先执行的模块，如果不提供的话，就默认是["require", "exports", "module"]，就会扫描工厂方法的require来获得依赖。就是CommonJS的写法了(这个不就是CMD吗？)

任何全局函数必须有一个amd属性来标识遵循AMD编程接口。

## Requirejs
这个加载器主要解决的问题：

 - 大量JS引入页面的时候会导致页面假死，用了之后就变成异步的了
 - 还有处理各模块之间的依赖，因为不用的话可能JS的引入顺序需要自己控制好
