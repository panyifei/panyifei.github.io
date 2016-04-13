# Reuqirejs介绍以及源码阅读
Requirejs是AMD规范的比较好的实践，在看Requirejs之前先看下AMD的规范

## AMD规范
看的是github上的[中文翻译的规范](https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88))。

就是很简单的一个define方法

```javascript
  define(id?, dependencies?, factory);
```

 - id为这个定义的模块的名字，如果不提供，默认为指定的脚本的名字，如果提供了，必须是唯一的
 - 二参为依赖，就是模块需要先执行的模块。如果不提供或者提供默认的，就默认是["require", "exports", "module"]，就会扫描工厂方法的require来获得依赖。就是CommonJS的写法了(这个不就是CMD吗？)
 - 三参为函数，在所有的依赖被加载后会自动执行

任何全局函数必须有一个amd属性来标识遵循AMD编程接口。

## Requirejs
这个加载器主要解决的问题：

 - 大量JS引入页面的时候会导致页面假死，用了之后就变成异步的了
 - 还有处理各模块之间的依赖，因为不用的话可能JS的引入顺序需要自己控制好

### Requirejs使用
就是引一下requirejs，然后data-main指明入口文件。就像这样：

```html
<script src="require.js" data-main="main.js"></script>
```

然后我们在入口文件里面就可以申明依赖以及函数了。

```javascript
//main.js
//引了一个模块sec
requirejs(["sec"],function(sec){
   sec.action()
});
//sec.js
//这里按照commonjs的形式让requirejs自己去搜一遍，再引入third.js
define(function (require, exports, module) {
    var third =require('third');
    third();
    module.exports.action = function () {console.log(22)};
});
//third.js
define(function (require, exports, module) {
    module.exports = function () {console.log(11)};
});
```

入口文件里写requirejs或者define其实都行的。只是requirejs显示是在入口文件。这一这里的sec.js等等都是异步加载的，不会导致页面死在那里。

### 文件的路径问题
我们可以在主入口js中使用requirejs.config来进行配置。

```javascript
requirejs.config({
   baseUrl: "js/lib",
　 paths: {
　　  "sec": "sec.min"
　 }
})
```

我们可以配置基本的url，可以针对特别的模块单独定义路径，这里的路径还可以是网络请求的位置。

### 加载非amd规范的的模块
我们引入的模块都必须是define申明好的，如果不是的话，得在require里面申明一下。exports为对外输出的变量

```javascript
   require.config({
　　　　shim: {
　　　　　　'underscore':{
　　　　　　　　exports: '_'
　　　　　　},
　　　　　　'backbone': {
　　　　　　　　deps: ['underscore', 'jquery'],
　　　　　　　　exports: 'Backbone'
　　　　　　}
　　　　}
　　});
```

tudo:这个的写法得去看一看

### require.js的插件
提供了domready这种类似的插件

tudo:这些个插件也可以看下怎么写的

```javascript
require(['domready!'], function (doc){
　　　　// called once the DOM is ready
});
```


参考：

  http://www.ruanyifeng.com/blog/2012/11/require_js.html
