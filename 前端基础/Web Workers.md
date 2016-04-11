# Web Workers
Web Workers可以让JS运行到后台来解决JS线程冻结页面。我们可以将大量数据的处理交给worker来做，只将页面的渲染事情交给JS就好了。

目前支持的IE10+,Chrome,Safari等都是支持的。

安卓4.4以上才支持，Safari5。

## 使用Worker

```javascript
var myWorker = new Worker('need.js');
myWorker.postMessage("");//这句话说是用来启动worker的，或是worker不接受到信息是不会触发的，但是Chrome好像只要new了就会执行了..
```

传的数据都支持字符串的，传的数据自Safari4之后都是支持JSON格式的。所以JSON也都是可以使用的。注意，这些数据的传输都是拷贝赋值的，而不是共享的执行环境。

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

注意我们最好在主线程中监听下error事件，因为不监听的话，worker就会默默地失败了。

想要停止Worker的工作，就是简单的myWorker.termiate()就行了，执行流也没有问题。

worker自己也可以自杀，调用self.close()就可以了。但是在worker内部的正常顺序流调用好像有些问题(感觉这句话会被套上了默认的setTimeout)，最好在onmessage里面再进行自杀行为，比较靠谱。

## Worker全局作用域
Worker与所执行的JS代码完全在另一个作用域，与当前网页的代码不共用作用域。注意：Web Worker代码不能访问DOM，也无法任何方式影响页面的外观。

 - 全局对象就是worker对象本身，就是说self和this都指向worker对象。
 - 最小化的navigator对象，有online，appName，appVersion，userAgent和platFrom属性
 - 只读的location
 - settimeout，setInterval，cleartimeout，clearinterval
 - XMLHttpRequest构造函数

所以，worker的运行环境与页面相比，功能是相当有限的。

## worker引入其他的js
importScript('file1.js','file2.js');

这样子会按照file1，file2的顺序执行，并且会在两个都执行完了才会往下执行。感觉系统默认处理好了回调的问题。

## 专用worker和共享worker
共享的资源是能够在各个页面之间共享的，但是还是得同源的。规范也没有定好呢。

而且worker能够访问的资源太少了，基本只能主页面传递，local的，session之类的，页面信息都不能访问的到。

参考：

  http://www.html5rocks.com/zh/tutorials/workers/basics/
