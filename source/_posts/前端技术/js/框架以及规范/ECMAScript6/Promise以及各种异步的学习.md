---
layout: default
title: Promise以及各种异步的学习
---

Promise 是一个对象，用来传递异步操作，代表了某个未来才会知道的结果。

### 特点：

- 只有`异步操作的结果`可以决定这个对象的哪种状态，包括 pending，resolved，rejected，外界无法对它造成影响
- 一旦状态改变了，就会维持这个结果`不会再变`，你可以一直拿到这个结果

### 主要的功能

有了 promise，可以将一些异步操作以同步的形式保存下来，`避免层层嵌套`

### 缺点

- 无法取消
- 不设置回调，内部的错误就无法反映到外部
- pending 状态很长，我们不知道是即将完成还是刚刚开始

如果某些事件不断重复发生，可以用 stream 模式

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

传入一个函数生成 promise 对象，两个参数分别是`resolve`和`reject`（由 js 引擎提供，不用自己部署）

实例生成过后

#### then 方法

指定成功以及失败时的`回调函数`，第二个是可选的，不一定要提供，这个东西可以在 catch 方法中做

```javascript
promise.then(
  function(value) {
    // success
  },
  function(value) {
    // failure
  }
);
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

就是`timeout`函数 return 的 promise 里面有个定时器，时间到了执行`resolve`，将‘done’传进去，然后用 then 来指定对应的 resolved，输出传入的 value。

#### 异步加载图片的例子

```javascript
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    var image = new Image();
    image.onload = function() {
      resolve(image);
    };
    image.onerror = function() {
      reject(new Error("Could not load image at " + url));
    };
    image.src = url;
  });
}
```

就是在 onload 和 onerror 事件的时候调用 resolved 和 reject

#### Ajax 操作的例子

```javascript
var getJSON = function(url) {
  var promise = new Promise(function(resolve, reject) {
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
    }
  });
  return promise;
};
getJSON("/posts.json").then(
  function(json) {
    console.log("Contents: " + json);
  },
  function(error) {
    console.error("出错了", error);
  }
);
```

就是在监听 statuscode 的时候区分调用了下 resolved 和 reject

#### resolve 传入 promise 实例

```javascript
var p1 = new Promise(function(resolve, reject) {
  // ...
});
var p2 = new Promise(function(resolve, reject) {
  // ...
  resolve(p1);
});
```

这里 p2 的状态依赖 p1 的状态，只有 p1 改变了，p2 才会跟着改变

```javascript
var p1 = new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error("fail")), 3000);
});
var p2 = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(p1), 1000);
});
p2.then(result => console.log(result));
p2.catch(error => console.log(error));
// Error: fail
```

- 这里 p2 在 1 秒后调用 resolve，但是 p1 没变，所以等待；
- 3 秒后，p1 变成 reject，p2 也就变成了 reject
- 这里返回的结果 p3 是可以拿得到的

#### then 方法

`then方法`返回的是一个新的 promise 的实例

所以可以`链式写法`，在 then 之后再调用 then

```javascript
getJSON("/post/1.json")
  .then(function(post) {
    return getJSON(post.commentURL);
  })
  .then(
    function funcA(comments) {
      console.log("Resolved: ", comments);
    },
    function funcB(err) {
      console.log("Rejected: ", err);
    }
  );
```

#### catch 方法

catch 其实就是一个`.then(null,rejection)`

```javascript
getJSON("/post/1.json")
  .then(function(post) {
    return getJSON(post.commentURL);
  })
  .then(function(comments) {
    // some code
  })
  .catch(function(error) {
    // 处理前面三个Promise产生的错误
  });
```

这里的话，有 3 个 promise，getJSON 本身，然后两个 then 方法得到的 promose，这里的抛出的错误，以及变化成 rejected 都是可以在最后被 catch 住的。

- catch 是会冒泡的，只要在最后写个 catch 就能拿到
- catch 返回的还是一个 promise
- Promise 的错误不会传递到外层代码，如果不 catch，直接消失

```javascript
var promise = new Promise(function(resolve, reject) {
  resolve("ok");
  setTimeout(function() {
    throw new Error("test");
  }, 0);
});
promise.then(function(value) {
  console.log(value);
});
// ok
// Uncaught Error: test
```

这里报错是因为 promise 已经执行结束了，这里的错误会被抛出到函数体外，讲道理的话，不会这么写...

```javascript
process.on("unhandledRejection", function(err, p) {
  console.error(err.stack);
});
```

nodejs 里面的 unhandledRejection 事件，专门监听未捕获的 reject 错误

#### all 方法

将多个 promise 的实例，包装成一个新的 promise 实例。（可以不是数组，但是得具有 iterator 接口，且返回的都是 Promise 对象，如果不是，会先调用 Promise.resolve 方法，将参数转化为 Promise 实例）

```javascript
var p = Promise.all([p1, p2, p3]);
```

- 必须全成功才会成功，成功之后，结果会成为数组，传给回调
- 有一个失败了就失败了，第一个被 reject 的实例的返回值传给 p 的回调

#### race 方法

var p = Promise.race([p1,p2,p3]);

有一个改变了状态，p 的状态就跟着变，然后他的值会传递给 p 的回调

```javascript
var p = Promise.race([
  fetch("/resource-that-may-take-a-while"),
  new Promise(function(resolve, reject) {
    setTimeout(() => reject(new Error("request timeout")), 5000);
  })
]);
p.then(response => console.log(response));
p.catch(error => console.log(error));
```

这里的例子就是加了个 timeout 的设置

#### resolve 方法

这个方法将现有的对象装化为 promise 对象，可不带参数
就是看有没有 then 方法，如果没有，直接就是状态为 resolved 的 promise

```javascript
var p = Promise.resolve("Hello");
p.then(function(s) {
  console.log(s);
});
// Hello
```

- 如果是 promise 的实例，那就直接返回实例

#### reject 方法

Promise.reject()返回一个新的 promise，且实例状态为 rejected

```javascript
var p = Promise.reject("出错了");
// 等同于
var p = new Promise((resolve, reject) => reject("foo"));
p.then(null, function(s) {
  console.log(s);
});
```

#### 应用

加载图片

```javascript
const preloadImage = function(path) {
  return new Promise(function(resolve, reject) {
    var image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```

异步的四种： 1.回调 2.事件监听 3.发布/订阅
4.Promise 对象

1 最以前就是回调函数了，但是一层层的写，很容易 callback hell
4 所以 promise 可以把代码写成纵向的加载，最大的问题，代码冗余，无论什么，被包装了都是一堆的 then
generator 函数就是将控制权抛了出去

tudo：stream 模式是个啥？
tudo:多个 then 在一起，其中一个出了错，剩下的还会执行吗？还是直接到 catch 的地方？
tudo:如果不 catch，是不是直接挂掉？catch 里面的例子测试一下
tudo:resovle 方法如果有 then 的话会发生什么呢？
