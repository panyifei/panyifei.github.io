---
layout: default
title: {{ site.name }}
---
# Promise以及各种异步的学习
Promise是一个对象，用来传递异步操作，代表了某个未来才会知道的结果。

### 特点：

- 只有`异步操作的结果`可以决定这个对象的哪种状态，包括pending，resolved，rejected，外界无法对它造成影响
- 一旦状态改变了，就会维持这个结果`不会再变`，你可以一直拿到这个结果

### 主要的功能
有了promise，可以将一些异步操作以同步的形式保存下来，`避免层层嵌套`

### 缺点
- 无法取消
- 不设置回调，内部的错误就无法反映到外部
- pending状态很长，我们不知道是即将完成还是刚刚开始

如果某些事件不断重复发生，可以用stream模式

### 具体的使用

#### 创建实例

```javascript
var promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

传入一个函数生成promise对象，两个参数分别是`resolve`和`reject`（由js引擎提供，不用自己部署）

实例生成过后

#### then方法
指定成功以及失败时的`回调函数`，第二个是可选的，不一定要提供，这个东西可以在catch方法中做

```javascript
promise.then(function(value) {
  // success
}, function(value) {
  // failure
});
```

#### 简单的例子

function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}

timeout(100).then((value) => {
  console.log(value);
});

就是`timeout`函数return的promise里面有个定时器，时间到了执行`resolve`，将‘done’传进去，然后用then来指定对应的resolved，输出传入的value。

#### 异步加载图片的例子
```javascript
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    var image = new Image();
    image.onload = function() {
      resolve(image);
    };
    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };
    image.src = url;
  });
}
```

就是在onload和onerror事件的时候调用resolved和reject

#### Ajax操作的例子
```javascript
var getJSON = function(url) {
  var promise = new Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();
    function handler() {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
  });
  return promise;
};
getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```

就是在监听statuscode的时候区分调用了下resolved和reject

#### resolve传入promise实例
```javascript
var p1 = new Promise(function(resolve, reject){
  // ...
});
var p2 = new Promise(function(resolve, reject){
  // ...
  resolve(p1);
})
```

这里p2的状态依赖p1的状态，只有p1改变了，p2才会跟着改变

```javascript
var p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})
var p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})
p2.then(result => console.log(result))
p2.catch(error => console.log(error))
// Error: fail
```

- 这里p2在1秒后调用resolve，但是p1没变，所以等待；
- 3秒后，p1变成reject，p2也就变成了reject
- 这里返回的结果p3是可以拿得到的

#### then方法

`then方法`返回的是一个新的promise的实例

所以可以`链式写法`，在then之后再调用then

```javascript
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function funcA(comments) {
  console.log("Resolved: ", comments);
}, function funcB(err){
  console.log("Rejected: ", err);
});
```

#### catch方法

catch其实就是一个`.then(null,rejection)`

```javascript
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

这里的话，有3个promise，getJSON本身，然后两个then方法得到的promose，这里的抛出的错误，以及变化成rejected都是可以在最后被catch住的。

- catch是会冒泡的，只要在最后写个catch就能拿到
- catch返回的还是一个promise
- Promise的错误不会传递到外层代码，如果不catch，直接消失

```javascript
var promise = new Promise(function(resolve, reject) {
  resolve("ok");
  setTimeout(function() { throw new Error('test') }, 0)
});
promise.then(function(value) { console.log(value) });
// ok
// Uncaught Error: test
```

这里报错是因为promise已经执行结束了，这里的错误会被抛出到函数体外，讲道理的话，不会这么写...

```javascript
process.on('unhandledRejection', function (err, p) {
  console.error(err.stack)
});
```

nodejs里面的unhandledRejection事件，专门监听未捕获的reject错误

#### all方法
将多个promise的实例，包装成一个新的promise实例。（可以不是数组，但是得具有iterator接口，且返回的都是Promise对象，如果不是，会先调用Promise.resolve方法，将参数转化为Promise实例）

```javascript
var p = Promise.all([p1,p2,p3]);
```

- 必须全成功才会成功，成功之后，结果会成为数组，传给回调
- 有一个失败了就失败了，第一个被reject的实例的返回值传给p的回调

#### race方法

var p = Promise.race([p1,p2,p3]);

有一个改变了状态，p的状态就跟着变，然后他的值会传递给p的回调

```javascript
var p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
])
p.then(response => console.log(response))
p.catch(error => console.log(error))
```

这里的例子就是加了个timeout的设置

#### resolve方法
这个方法将现有的对象装化为promise对象，可不带参数
就是看有没有then方法，如果没有，直接就是状态为resolved的promise

```javascript
var p = Promise.resolve('Hello');
p.then(function (s){
  console.log(s)
});
// Hello
```
- 如果是promise的实例，那就直接返回实例

#### reject方法
Promise.reject()返回一个新的promise，且实例状态为rejected

```javascript
var p = Promise.reject('出错了');
// 等同于
var p = new Promise((resolve, reject) => reject('foo'))
p.then(null, function (s){
  console.log(s)
});
```

#### 应用
加载图片

```javascript
const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```



异步的四种：
1.回调
2.事件监听
3.发布/订阅
4.Promise对象

1最以前就是回调函数了，但是一层层的写，很容易callback hell
4所以promise可以把代码写成纵向的加载，最大的问题，代码冗余，无论什么，被包装了都是一堆的then
generator函数就是将控制权抛了出去

tudo：stream模式是个啥？
tudo:多个then在一起，其中一个出了错，剩下的还会执行吗？还是直接到catch的地方？
tudo:如果不catch，是不是直接挂掉？catch里面的例子测试一下
tudo:resovle方法如果有then的话会发生什么呢？
