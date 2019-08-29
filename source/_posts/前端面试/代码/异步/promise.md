---
layout: default
title: promise
categories:
  - 前端面试
  - 代码
---

写一些 promise 的 pollyfill 以及执行顺序相关

- 相关 pollyfill
  - promise.all
  - promise.finally
- 执行顺序
  - 并行执行 promise 发送请求返回结果
  - 串行执行 promise 发送请求返回结果
  - 执行 n 次 promise 发送请求返回结果

## 相关 pollyfill

### promise.all

```javascript
// 写一个promise.all

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

### promise.finally

```javascript
// 用p点resolve是希望cb如果是个promise，需要等他执行完再执行。

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

## 执行顺序
