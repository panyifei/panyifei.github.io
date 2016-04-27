# Web Workers
Web Workers可以让JS运行到后台，来解决JS线程可能会冻结页面的问题。我们可以将大量数据的处理交给worker来做，只将页面的渲染事情交给JS就好了。

基本现在有三种worker：Worker(Dedicated Worker)，SharedWorker和Service Worker。

浏览器支持情况：

 - Worker：IE10+,Chrome,Safari5+等都是支持的，安卓4.4以上才支持。
 - SharedWorker：IE不支持，安卓不支持。
 - ServiceWorker：Chrome42以上才支持(实验中的)

## 使用Worker

```javascript
var myWorker = new Worker('need.js');
myWorker.postMessage("");//这句话说是用来启动worker的，说是worker不接受到信息是不会触发的，但是Chrome好像只要new了就会执行..
```

传的数据都支持字符串，自Safari4之后都支持JSON格式。所以JSON也都是可以使用的。注意，这些数据的传输都是拷贝赋值的，而不是共享的执行环境。

相互之间都是通过postMessage和onmessage来通信的。

```javascript
//主线程
var myWorker = new Worker('worker.js');
myWorker.onmessage = function (oEvent) {
    console.log(oEvent.data);
};
myWorker.postMessage("从主线程来的");
//worker.js内部
onmessage = function (oEvent) {
    console.log(oEvent.data);
};
postMessage('worker的数据1');
postMessage('worker的数据2');
postMessage('worker的数据3');
```

注意我们最好在主页面中监听下error事件，因为不监听的话，worker就会默默地失败了。

想要停止Worker的工作，只要在主页面简单的myWorker.termiate()就行了，执行流也没有问题。

worker自己也可以自杀，调用self.close()就可以了。但是在worker内部的正常顺序流调用好像有些问题(感觉这句话会被套上了默认的setTimeout)，最好在onmessage里面再调用close，比较靠谱。

## Worker全局作用域
Worker与主页面所执行的JS完全在不一样的作用域内，并不共用作用域。注意：Web Worker代码不能访问DOM，也无法任何方式影响页面的外观。特点如下：

 - 全局对象就是worker对象本身，就是说self和this都指向worker对象。
 - 最小化的navigator对象，有online，appName，appVersion，userAgent和platFrom属性
 - 只读的location
 - settimeout，setInterval，cleartimeout，clearinterval
 - XMLHttpRequest构造函数

所以，worker的运行环境与页面相比，功能是相当有限的。

## worker引入其他的js
我们可以用下面的语句来引入其他的js(必须是同源策略)，importScript('file1.js','file2.js');

这样子会按照file1，file2的顺序执行，并且会在两个都执行完了才会往下执行。而且系统默认处理好了回调的问题，同步方式写代码就可以了。

就是说importScripts是`阻塞型`的

## 专用worker和共享worker
共享的资源是能够在各个页面之间共享的，但是还是得同源的。规范也没有定好呢..

而且worker能够访问的资源太少了，基本只能主页面传递，local的，session之类的，页面信息都不能访问的到。

## 共享worker
这个东西的支持程度很差，他与worker的不同之处在于他能够被同源的多个tab页面所访问到。如果所有的tab页被关闭，那这个worker才会被关闭。使用例子：

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

[mdn给的官方例子](https://github.com/mdn/simple-shared-worker)完全没能体现Sharedworker的共享的特性，差评。

## service worker
这是个实验中的属性，chrome42以上才能够使用。基本就是测试中..

service worker可以监听fetch事件(拦截所有的网络请求)，开发者可以来做网络代理来做网络拦截，提供了离线的能力(没有页面也能执行)。

sw被更新的时候，会重新下载新的，然后install，然后等到页面上没有使用sw了，就会把老的卸掉，使用新的sw。

他还能够做后台推送的事情(我的理解为因为这个SW会至少24小时重新下载一次，然后在里面写上脚本，执行上面的更新操作后，触发推送)。

注意sw只能运行在https中，localhost也可以。

参考：

  http://www.html5rocks.com/zh/tutorials/workers/basics/

  http://imweb.io/topic/559d13ec3d7bb8096b69cfcf

  http://www.alloyteam.com/2016/01/9274/
