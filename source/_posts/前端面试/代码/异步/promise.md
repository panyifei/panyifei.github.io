---
layout: default
title: promise
categories:
  - 前端面试
  - 代码
---

手写一些 promise 的 pollyfill 以及执行顺序相关（执行顺序头条面试问到过）。

- 相关 pollyfill
  - promise.all
  - promise.finally
- 执行顺序
  - 并行执行 promise 发送请求返回结果
  - 串行执行 promise 发送请求返回结果
  - 执行 n 次 promise 发送请求返回结果

# 手写 pollyfill

## promise.all

写一个 promise.all 的 pollyfill

### 思路

很简单，就是构建一个 promise，都执行完了返回结果

```javascript
function all(list) {
  let count = 0;
  let resValues = [];
  return new Promise((resolve, reject) => {
    list.forEach((p, i) => {
      Promise.resolve(p).then(
        res => {
          count++;
          resValues[i] = res;
          if (count === list.length) {
            resolve(resValues);
          }
        },
        err => {
          reject(err);
        }
      );
    });
  });
}
var p1 = Promise.resolve(1),
  p2 = Promise.resolve(2),
  p3 = Promise.resolve(3);
all([p1, p2, p3]).then(function(value) {
  console.log(value);
});
```

## promise.finally

用 p.resolve 是希望 cb 如果是个 promise，需要等他执行完再执行。

```javascript
Promise.prototype.finally = function(cb) {
  const p = this.constructor;
  return this.then(
    value =>
      p.resolve(cb()).then(() => {
        return value;
      }),
    error =>
      p.resolve(cb()).then(() => {
        throw error;
      })
  );
};
```

# 执行顺序

面试头条问到过的题目，提供一个 getData(url)的 promise 方法，可以获取请求数据。按照要求构造方法返回 promise。

```javascript
// 提供的帮助函数
function getData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url);
    }, 1000);
  });
}
```

## 并行执行 promise 发送请求返回结果

输入是 url 的数组，输出是一个 promise，要求并行发送请求。

### 思路

直接用 promise.all 就能实现

```javascript
function parallelFetch(urls) {
  const promiseArr = [];
  urls.forEach(u => {
    promiseArr.push(getData(u));
  });
  return Promise.all(promiseArr);
}
```

## 串行执行 promise 发送请求返回结果

输入是 url 的数组，输出是一个 promise，要求串行发送请求。

### 思路

这一题我没能答出来，串行返回 promise 没能想到用 reduce 来做，可惜，想到了就很简单了，每次 then 都能将 getData 执行完。

```javascript
function serialFetch(urls) {
  return urls.reduce((p, u) => {
    return p.then(data => {
      console.log(data);
      return getData(u);
    });
  }, Promise.resolve());
}
```

## 执行 n 次 promise 发送请求返回结果

输入是 url 以及次数 n，输出是一个 promise，要求成功了就返回结果，失败了就重试 n 次。

### 思路

思路很简单，成功了就返回结果，失败了就进行检查，如果少于 n 次就递归，

```javascript
function tryFetch(url, n) {
  return getData(url).then(
    data => {
      return data;
    },
    () => {
      if (n > 1) {
        return tryFetch(url, n - 1);
      }
    }
  );
}

// test case
let n = 0;
function getData(url) {
  n++;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (n > 4) {
        console.log("成功");
        resolve("success");
      } else {
        console.log("失败");
        reject("error");
      }
    }, 1000);
  });
}
tryFetch("123", 3).then(
  data => {
    console.log(data);
  },
  error => {
    console.log(error);
  }
);
```

promise 的面试题还是挺考验编程能力的，可以着重准备下。
