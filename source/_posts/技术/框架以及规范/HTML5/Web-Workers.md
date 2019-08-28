---
layout: default
title: Web Workers
---

Web Workers 可以让 JS 运行到后台，来解决 JS 线程可能会冻结页面的问题。我们可以将大量数据的处理交给 worker 来做，只将页面的渲染事情交给 JS 就好了。

基本现在有三种 worker：Worker(Dedicated Worker)，SharedWorker 和 Service Worker。

浏览器支持情况：

- Worker：IE10+,Chrome,Safari5+等都是支持的，安卓 4.4 以上才支持。
- SharedWorker：IE 不支持，安卓不支持。
- ServiceWorker：Chrome42 以上才支持(实验中的)

## 使用 Worker

```javascript
var myWorker = new Worker("need.js");
myWorker.postMessage(""); //这句话说是用来启动worker的，说是worker不接受到信息是不会触发的，但是Chrome好像只要new了就会执行..
```

传的数据都支持字符串，自 Safari4 之后都支持 JSON 格式。所以 JSON 也都是可以使用的。注意，这些数据的传输都是拷贝赋值的，而不是共享的执行环境。

相互之间都是通过 postMessage 和 onmessage 来通信的。

```javascript
//主线程
var myWorker = new Worker("worker.js");
myWorker.onmessage = function(oEvent) {
  console.log(oEvent.data);
};
myWorker.postMessage("从主线程来的");
//worker.js内部
onmessage = function(oEvent) {
  console.log(oEvent.data);
};
postMessage("worker的数据1");
postMessage("worker的数据2");
postMessage("worker的数据3");
```

注意我们最好在主页面中监听下 error 事件，因为不监听的话，worker 就会默默地失败了。

想要停止 Worker 的工作，只要在主页面简单的 myWorker.termiate()就行了，执行流也没有问题。

worker 自己也可以自杀，调用 self.close()就可以了。但是在 worker 内部的正常顺序流调用好像有些问题(感觉这句话会被套上了默认的 setTimeout)，最好在 onmessage 里面再调用 close，比较靠谱。

## Worker 全局作用域

Worker 与主页面所执行的 JS 完全在不一样的作用域内，并不共用作用域。注意：Web Worker 代码不能访问 DOM，也无法任何方式影响页面的外观。特点如下：

- 全局对象就是 worker 对象本身，就是说 self 和 this 都指向 worker 对象。
- 最小化的 navigator 对象，有 online，appName，appVersion，userAgent 和 platFrom 属性
- 只读的 location
- settimeout，setInterval，cleartimeout，clearinterval
- XMLHttpRequest 构造函数

所以，worker 的运行环境与页面相比，功能是相当有限的。

## worker 引入其他的 js

我们可以用下面的语句来引入其他的 js(必须是同源策略)，importScript('file1.js','file2.js');

这样子会按照 file1，file2 的顺序执行，并且会在两个都执行完了才会往下执行。而且系统默认处理好了回调的问题，同步方式写代码就可以了。

就是说 importScripts 是`阻塞型`的

## 专用 worker 和共享 worker

共享的资源是能够在各个页面之间共享的，但是还是得同源的。规范也没有定好呢..

而且 worker 能够访问的资源太少了，基本只能主页面传递，local 的，session 之类的，页面信息都不能访问的到。

## 共享 worker

这个东西的支持程度很差，他与 worker 的不同之处在于他能够被同源的多个 tab 页面所访问到。如果所有的 tab 页被关闭，那这个 worker 才会被关闭。使用例子：

```javascript
//main
if (!!window.SharedWorker) {
  var myWorker = new SharedWorker("worker.js");
  myWorker.port.onmessage = function(e) {
    console.log(e.data);
  }
}
//worker.js
var s=1;
onconnect = function(e) {
	s++;
  var  = e.ports[0];
	port.onmessage = function(e) {
	  port.postMessage("");
	}
	port.postMessage(s);
}
//打开多个页面的时候s的值会被递增，也就是说，新建worker，就会触发connect。worker.js的内部变量是可以被各个tab访问到的。
```

[mdn 给的官方例子](https://github.com/mdn/simple-shared-worker)完全没能体现 Sharedworker 的共享的特性，差评。

## service worker

这是个实验中的属性，chrome42 以上才能够使用。基本就是测试中..

service worker 可以监听 fetch 事件(拦截所有的网络请求)，开发者可以来做网络代理来做网络拦截，提供了离线的能力(没有页面也能执行)。

sw 被更新的时候，会重新下载新的，然后 install，然后等到页面上没有使用 sw 了，就会把老的卸掉，使用新的 sw。

他还能够做后台推送的事情(我的理解为因为这个 SW 会至少 24 小时重新下载一次，然后在里面写上脚本，执行上面的更新操作后，触发推送)。

注意 sw 只能运行在 https 中，localhost 也可以。

参考：

http://www.html5rocks.com/zh/tutorials/workers/basics/

http://imweb.io/topic/559d13ec3d7bb8096b69cfcf

http://www.alloyteam.com/2016/01/9274/
