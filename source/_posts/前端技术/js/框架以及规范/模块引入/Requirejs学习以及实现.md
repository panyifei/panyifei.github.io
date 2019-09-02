---
layout: default
title: Reuqirejs学习以及实现
categories:
  - 前端技术
  - js
  - 框架以及规范
---

Requirejs 是 AMD 规范的比较好的实践，在看 Requirejs 之前先看下 AMD 的规范

## AMD 规范

看的是 github 上的[中文翻译的规范](<https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88)>)。

就是很简单的一个 define 方法

```javascript
  define(id?, dependencies?, factory);
```

- id 为这个定义的模块的名字，如果不提供，默认为指定的脚本的名字，如果提供了，必须是唯一的
- 二参为依赖，就是模块需要先执行的模块。如果不提供或者提供默认的，就默认是["require", "exports", "module"]，就会扫描工厂方法的 require 来获得依赖。就是 CommonJS 的写法了(这个不就是 CMD 吗？)
- 三参为函数，在所有的依赖被加载后会自动执行

任何全局函数必须有一个 amd 属性来标识遵循 AMD 编程接口。

## Requirejs

这个加载器主要解决的问题：

- 大量 JS 引入页面的时候会导致页面假死，用了之后就变成异步的了
- 还有处理各模块之间的依赖，因为不用的话可能 JS 的引入顺序需要自己控制好

### Requirejs 使用

就是引一下 requirejs，然后 data-main 指明入口文件。就像这样：

```html
<script src="require.js" data-main="main.js"></script>
```

然后我们在入口文件里面就可以申明依赖以及函数了。

```javascript
//main.js
//引了一个模块sec
requirejs(["sec"], function(sec) {
  sec.action();
});
//sec.js
//这里按照commonjs的形式让requirejs自己去搜一遍，再引入third.js
define(function(require, exports, module) {
  var third = require("third");
  third();
  module.exports.action = function() {
    console.log(22);
  };
});
//third.js
define(function(require, exports, module) {
  module.exports = function() {
    console.log(11);
  };
});
```

入口文件里写 requirejs 或者 define 其实都行的。只是 requirejs 显示是在入口文件。这一这里的 sec.js 等等都是异步加载的，不会导致页面死在那里。

### 文件的路径问题

我们可以在主入口 js 中使用 requirejs.config 来进行配置。

```javascript
requirejs.config({
  baseUrl: "js/lib",
  paths: {
    sec: "sec.min"
  }
});
```

我们可以配置基本的 url，可以针对特别的模块单独定义路径，这里的路径还可以是网络请求的位置。

### 加载非 amd 规范的的模块

我们引入的模块都必须是 define 申明好的，如果不是的话，得在 require 里面申明一下。exports 为对外输出的变量

```javascript
require.config({
  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }
});
```

tudo:这个的写法得去看一看

### require.js 的插件

提供了 domready 这种类似的插件

tudo:这些个插件也可以看下怎么写的

```javascript
require(["domready!"], function(doc) {
  // called once the DOM is ready
});
```

### 写一个 require

在阅读源码之前，先试着实现一把。[链接](https://github.com/panyifei/Front-end-learning/tree/master/Demo)

先实现 data-main 的主入口，很简单就是分析整个页面，得到 data-main，然后新建了一个 script，来异步加载 js。

```javascript
var scripts = document.getElementsByTagName("script");
var sLength = scripts.length;
var mainJs;
for (var i = 0; i < sLength; i++) {
  var name = scripts[i].getAttribute("data-main");
  if (name) {
    mainJs = name;
  }
}
var mainScript = document.createElement("script");
mainScript.src = mainJs;
document.body.appendChild(mainScript);
```

然后就是声明 define 方法，我最开始的时候使用的是 onload 来通知，这样子可以解决一层的依赖。就是如果 main 依赖了 a 和 b，是可以的。但是如果 b 依赖了 c，这种方法就失败了。

```javascript
//allModule用来保存所有加载的模块
var allModule = {};
//主要的define方法
var define = function(id, array, cb) {
  var length = array.length;
  if (length > 0) {
    var i = 0;
    array.forEach(function(value, index, array) {
      var tempScript = document.createElement("script");
      tempScript.src = array[index] + ".js";
      //目前用的onload来监听加载完毕，但是如果有依赖的话，就不行了
      tempScript.onload = function() {
        i++;
        finish();
      };
      document.body.appendChild(tempScript);
    });
    function finish() {
      if (i == length) {
        var modules = [];
        for (var x = 0; x < array.length; x++) {
          modules[x] = allModule[array[x]];
        }
        allModule[id] = cb.apply(null, modules);
      }
    }
  } else {
    allModule[id] = cb();
  }
};
```

于是我不用 onload 来通知，选择在不依赖其他的模块调用完成时来进行通知，并且引用过他的模块尝试执行 callback，如果这个模块所需要的都加载完了就可以执行。一层层的向上通知。

```javascript
//allModule用来保存所有加载的模块
var allModule = {};
//主要的define方法
function _registerModule(id, dependence, father) {
  if (!allModule[id]) {
    allModule[id] = {};
    var newModule = allModule[id];
    newModule.func = undefined; //模块的结果
    newModule.dependence = dependence; //依赖的模块
    newModule.dependenceLoadNum = 0; //已经依赖的模块
    newModule.finishLoad = function() {}; //完成load之后触发的方法
    if (father) {
      if (newModule.referrer) {
        newModule.referrer.push(father);
      } else {
        newModule.referrer = []; //被引用到的模块
        newModule.referrer.push(father);
      }
    }
  } else {
    var newModule = allModule[id];
    if (father) {
      newModule.referrer.push(father);
    }
    if (dependence) {
      newModule.dependence = dependence;
      newModule.dependenceLoadNum = 0;
    }
  }
}
var define = function(id, array, cb) {
  _registerModule(id, array, "");
  array.forEach(function(value, index, array) {
    _registerModule(array[index], [], id);
  });
  var thisModule = allModule[id];
  if (array.length > 0) {
    array.forEach(function(value, index, array) {
      var tempScript = document.createElement("script");
      tempScript.src = array[index] + ".js";
      document.body.appendChild(tempScript);
    });
    thisModule.finishLoad = _finish;
  } else {
    thisModule.func = cb();
    _refererFinish();
  }
  function _finish() {
    thisModule.dependenceLoadNum++;
    if (thisModule.dependenceLoadNum == thisModule.dependence.length) {
      var modules = [];
      for (var x = 0; x < array.length; x++) {
        modules[x] = allModule[array[x]].func;
      }
      thisModule.func = cb.apply(null, modules);
    }
    _refererFinish();
  }
  function _refererFinish() {
    if (thisModule.referrer) {
      thisModule.referrer.forEach(function(value, index, array) {
        allModule[array[index]].finishLoad();
      });
    }
  }
};
```

这样子实现了一个精简版的 API，准备再看下 requirejs 是如何做的。

## 优化

在勐喆的指导下进行了一次简单的逻辑优化，因为在现在的实现中，每个模块都既存了依赖的列表，以及被依赖到的列表。可以通过事件监听的形式进行一次解耦。也就是模块不再需要知道谁依赖了他，通过注册事件的形式来通知。

```javascript
//allModule用来保存所有加载的模块
var allModule = [];
function Module(id, dependence) {
  this.func = undefined;
  this.dependence = dependence;
  this.dependenceLoadNum = 0;
  this.handlers = {};
}
Module.prototype = {
  on: function(name, handler) {
    if (!this.handlers[name]) {
      this.handlers[name] = [];
      this.handlers[name].push(handler);
    } else {
      this.handlers[name].push(handler);
    }
  },
  emit: function(name) {
    if (!!this.handlers[name]) {
      this.handlers[name].forEach(function(value) {
        value();
      });
    }
  }
};
function _registerModule(id, dependence) {
  var i = allModule.length;
  if (!allModule[id]) {
    allModule[i++] = allModule[id] = new Module(id, dependence);
  } else {
    if (dependence) {
      allModule[id].dependence = dependence;
      allModule[id].dependenceLoadNum = 0;
    }
  }
  dependence.forEach(function(value) {
    _registerModule(value, []);
  });
}
//cb为加载完了执行的方法
var define = function(id, array, cb) {
  //注册相关的模块
  _registerModule(id, array);
  var thisModule = allModule[id];
  if (array.length > 0) {
    array.forEach(function(value) {
      thisModule.on("finish" + value, function() {
        _finish();
        _notifyModule();
      });
      var tempScript = document.createElement("script");
      tempScript.src = value + ".js";
      document.body.appendChild(tempScript);
    });
  } else {
    thisModule.func = cb();
    _notifyModule();
  }
  function _finish() {
    thisModule.dependenceLoadNum++;
    if (thisModule.dependenceLoadNum == thisModule.dependence.length) {
      var modules = [];
      array.forEach(function(value, index) {
        modules[index] = allModule[value].func;
      });
      thisModule.func = cb.apply(null, modules);
    }
  }
  //通知全局的模块加载完毕
  function _notifyModule() {
    allModule.forEach(function(value, index, array) {
      array[index].emit("finish" + id);
    });
  }
};
```

这样子的话，define 模块的时候就会注册依赖模块的监听器。然后在依赖的模块执行完了时候就会进行全局的触发\_notifyModule，通知每一个模块这个模块加载 OK。于是注册过这个事件的模块就会触发\_finish 方法。这样子最大的好处是进行了一次解耦，代价是会进行全局的广播的形式来通知。其实我们如果用 promise 来做的话，可以更好的管理状态，但是为了兼容性没有去尝试。

## 再次优化

上面全局通知的代价有些高，看完源码之后才发现，其实事件可以绑定在 dependence 的模块上面，这样就不用全局通知了。而且这次的修改支持多个文件同时引用一个模块了。

```javascript
function _registerModule(id, dependence, defined) {
  var i = allModule.length;
  if (!allModule[id]) {
    allModule[i++] = allModule[id] = new Module(id, dependence);
    allModule[id].defined = defined;
  } else {
    if (dependence) {
      allModule[id].dependence = dependence;
      allModule[id].dependenceLoadNum = 0;
    }
  }
  dependence.forEach(function(value) {
    _registerModule(value, [], false);
  });
}
//cb为加载完了执行的方法
var define = function(id, array, cb) {
  //注册相关的模块
  _registerModule(id, array, true);

  var thisModule = allModule[id];
  if (array.length > 0) {
    array.forEach(function(value) {
      allModule[value].on("finish", function() {
        _finish();
      });
      if (!allModule[value].defined) {
        var tempScript = document.createElement("script");
        tempScript.src = value + ".js";
        document.body.appendChild(tempScript);
      }
    });
  } else {
    thisModule.func = cb();
    thisModule.emit("finish");
  }
  function _finish() {
    thisModule.dependenceLoadNum++;
    if (thisModule.dependenceLoadNum == thisModule.dependence.length) {
      var modules = [];
      array.forEach(function(value, index) {
        modules[index] = allModule[value].func;
      });
      thisModule.func = cb.apply(null, modules);
      //继续向上层触发
      thisModule.emit("finish");
    }
  }
};
```

这次的优化改了 define 方法，去掉了全局的通知。还增加了 defined 属性来支持多个模块引用同一个模块。

参考：

http://www.ruanyifeng.com/blog/2012/11/require_js.html
