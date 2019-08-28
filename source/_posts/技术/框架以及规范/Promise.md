---
layout: default
title: Promise规范以及写一个Promise
---

看了些 promise 的介绍，但是还是感觉不够深入，这个在解决异步问题上是一个很好的解决方案，所以详细看一下。

## Promise/A+规范：

- 重新阅读了下 A+的[规范](https://promisesaplus.com/):
  - promise 代表了一个异步操作的最终结果，主要是通过 then 方法来注册成功以及失败的情况，
  - Promise/A+历史上说是实现了 Promise/A 的行为并且考虑了一些不足之处，他并不关心如何创建，完成，拒绝 Promise，只考虑提供一个可协作的 then 方法。

### 术语：

- `promise`是一个拥有符合上面的特征的 then 方法的对象或者方法。
- `thenable`是定义了 then 方法的对象或者方法
- `value`是任何合法的 js 的值（包括 undefined，thenable 或者 promise）
- `exception`是一个被 throw 申明抛出的值
- `reason`是一个指明了为什么 promise 被拒绝

### 2.1 状态要求：

- promise 必须是在 pending，fulfilled 或者 rejected 之间的一种状态。
- promise 一旦从 pending 变成了 fulfilled 或则 rejected，就不能再改变了。
- promise 变成 fulfilled 之后，必须有一个 value，并且不能被改变
- promise 变成 rejected 之后，必须有一个 reason，并且不能被改变

### 2.2 then 方法的要求：

- promise 必须有个 then 方法来接触当前的或者最后的 value 或者 reason
- then 方法接受两个参数，done 和 onRejected，这两个都是可选的，如果传入的不是 function 的话，就会被忽略
- 如果 done 是一个函数，他必须在 promise 完成后被执行(不能提前)，并且 value 是第一个参数，并且不能被执行超过一次
- 如果 onRejected 是一个函数，他必须在 promise 拒绝后被执行(不能提前)，并且 reason 是第一个参数，并且不能被执行超过一次
- done 或者 onRejected 只能在执行上下文堆只包含了平台代码的时候执行(就是要求 done 和 onrejected 必须异步执行，必须在 then 方法被调用的那一轮事件循环之后的新执行栈执行，这里可以使用 macro-task 或者 micro-task，这两个的区别参见[文章](https://github.com/panyifei/learning/blob/master/前端基础/Macro-task与Micro-task.md))
- done 或者 onRejected 必须作为 function 被执行(就是说没有一个特殊的 this，在严格模式中，this 就是 undefined，在粗糙的模式，就是 global)
- then 方法可能在同一个 promise 被调用多次，当 promise 被完成，所有的 done 必须被顺序执行，onRejected 也一样
- then 方法必须也返回一个 promise(这个 promise 可以是原来的 promise，实现必须申明什么情况下两者可以相等)promise2 = promise1.then(done, onRejected);
  - 如果`done`和`onRejected`都返回一个 value x，执行 2.3Promise 的解决步骤[[Resolve]](promise2, x)
  - 如果`done`和`onRejected`都抛出 exception e，promise2 必须被 rejected 同样的 e
  - 如果`done`不是个 function，且 promise1 is fulfilled，promise2 也会 fulfilled，和 promise1 的值一样
  - 如果`onRejected`不是个 function，且 promise1 is rejected，promise2 也会 rejected，理由和 promise1 一样

这里不论 promise1 被完成还是被拒绝，promise2 都会被 resolve 的，只有出现了一些异常才会被 rejected

### 2.3Promise 的解决步骤==[[Resolve]](promise2, x)

- 这个是将`promise`和一个值`x`作为输入的一个抽象操作。如果这个 x 是支持 then 的，他会尝试让 promise 接受 x 的状态；否则，他会用 x 的值来 fullfill 这个 promise。运行这样一个东西，遵循以下的步骤
- 如果 promise 和 x 指向同一个对象，则 reject 这个 promise 使用 TypeError。
- 如果 x 是一个 promise，接受他的状态
- 如果 x 在 pending，promise 必须等待 x 的状态改变
- 如果 x 被 fullfill，那么 fullfill 这个 promise 使用同一个 value
- 如果 x 被 reject，那么 reject 这个 promise 使用同一个理由
- 如果 x 是一个对象或者是个方法
- 如果 x.then 返回了错误，则 reject 这个 promise 使用错误。
- 如果 then 是一个方法，使用 x 为 this，resolvePromise 为一参，rejectPromise 为二参，
  - 如果 resolvePromise 被一个值 y 调用，那么运行[[Resolve]](promise, y)
  - 如果 rejectPromise 被 reason r，使用 r 来 reject 这个 promise
  - 如果 resolvePromise 和 rejectPromise 都被调用了，那么第一个被调用的有优先权，其他的 beihulue
  - 如果调用 then 方法得到了 exception，如果上面的方法被调用了，则忽略，否则 reject 这个 promise
- 如果 then 方法不是 function，那么 fullfill 这个 promise 使用 x
- 如果 x 不是一个对象或者方法，那么 fullfill 这个 promise 使用 x

如果 promise 产生了环形的嵌套，比如[[Resolve]](promise, thenable)最终唤起了[[Resolve]](promise, thenable)，那么实现建议且并不强求来发现这种循环，并且 reject 这个 promise 使用一个 TypeError。

## 写一个 promise

想要写一个 Promise，肯定得使用一个异步的函数，就拿 setTimeout 来做。

```javascript
var p = new Promise(function(resolve) {
  setTimeout(resolve, 100);
});
p.then(
  function() {
    console.log("success");
  },
  function() {
    console.log("fail");
  }
);
```

### 初步构建

上面是个最简单的使用场景我们需要慢慢来构建

```javascript
function Promise(fn) {
  //需要一个成功时的回调
  var doneCallback;
  //一个实例的方法，用来注册异步事件
  this.then = function(done) {
    doneCallback = done;
  };
  function resolve() {
    doneCallback();
  }
  fn(resolve);
}
```

### 加入链式支持

下面加入链式，成功回调的方法就得变成数组才能存储

```javascript
function Promise(fn) {
  //需要成功以及成功时的回调
  var doneList = [];
  //一个实例的方法，用来注册异步事件
  this.then = function(done, fail) {
    doneList.push(done);
    return this;
  };
  function resolve() {
    doneList.forEach(function(fulfill) {
      fulfill();
    });
  }
  fn(resolve);
}
```

这里 promise 里面如果是同步的函数的话，doneList 里面还是空的，所以可以加个 setTimeout 来将这个放到 js 的最后执行。这里主要是参照了 promiseA+的规范，就像这样

```javascript
function resolve() {
  setTimeout(function() {
    doneList.forEach(function(fulfill) {
      fulfill();
    });
  }, 0);
}
```

### 加入状态机制

这时如果 promise 已经执行完了，我们再给 promise 注册 then 方法就怎么都不会执行了，这个不符合预期，所以才会加入状态这种东西。更新过的代码如下

```javascript
function Promise(fn) {
  //需要成功以及成功时的回调
  var state = "pending";
  var doneList = [];
  //一个实例的方法，用来注册异步事件
  this.then = function(done) {
    switch (state) {
      case "pending":
        doneList.push(done);
        return this;
        break;
      case "fulfilled":
        done();
        return this;
        break;
    }
  };
  function resolve() {
    state = "fulfilled";
    setTimeout(function() {
      doneList.forEach(function(fulfill) {
        fulfill();
      });
    }, 0);
  }
  fn(resolve);
}
```

### 加上异步结果的传递

现在的写法根本没有考虑异步返回的结果的传递，我们来加上结果的传递

```javascript
function resolve(newValue) {
  state = "fulfilled";
  var value = newValue;
  setTimeout(function() {
    doneList.forEach(function(fulfill) {
      value = fulfill(value);
    });
  }, 0);
}
```

### 支持串行

这样子我们就可以将 then 每次的结果交给后面的 then 了。但是我们的 promise 现在还不支持 promise 的串行写法。比如我们想要

```javascript
var p = new Promise(function(resolve) {
  setTimeout(function() {
    resolve(12);
  }, 100);
});
var p2 = new Promise(function(resolve) {
  setTimeout(function() {
    resolve(42);
  }, 100);
});
p.then(function(name) {
  console.log(name);
  return 33;
})
  .then(function(id) {
    console.log(id);
  })
  .then(p2)
  .then(function(home) {
    console.log(home);
  });
```

所以我们必须改下 then 方法。

当 then 方法传入一般的函数的时候，我们目前的做法是将它推进了一个数组，然后 return this 来进行链式的调用，并且期望在 resolve 方法调用时执行这个数组。

最开始我是研究的美团工程师的[一篇博客](http://tech.meituan.com/promise-insight.html),到这里的时候发现他的解决方案比较跳跃，于是我就按照普通的正常思路先尝试了下：

如果传入一个 promise 的话，我们先尝试继续推入数组中，在 resolve 的地方进行区分，发现是可行的，我先贴下示例代码，然后会有详细的注释。

```javascript
function Promise(fn) {
  //需要成功以及成功时的回调
  var state = "pending";
  var doneList = [];
  this.then = function(done) {
    switch (state) {
      case "pending":
        doneList.push(done);
        return this;
        break;
      case "fulfilled":
        done();
        return this;
        break;
    }
  };
  function resolve(newValue) {
    state = "fulfilled";
    setTimeout(function() {
      var value = newValue;
      //执行resolve时，我们会尝试将doneList数组中的值都执行一遍
      //当遇到正常的回调函数的时候，就执行回调函数
      //当遇到一个新的promise的时候，就将原doneList数组里的回调函数推入新的promise的doneList，以达到循环的目的
      for (var i = 0; i < doneList.length; i++) {
        var temp = doneList[i](value);
        if (temp instanceof Promise) {
          var newP = temp;
          for (i++; i < doneList.length; i++) {
            newP.then(doneList[i]);
          }
        } else {
          value = temp;
        }
      }
    }, 0);
  }
  fn(resolve);
}
var p = function() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve("p 的结果");
    }, 100);
  });
};
var p2 = function(input) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      console.log("p2拿到前面传入的值：" + input);
      resolve("p2的结果");
    }, 100);
  });
};
p()
  .then(function(res) {
    console.log("p的结果:" + res);
    return "p then方法第一次返回";
  })
  .then(function(res) {
    console.log("p第一次then方法的返回：" + res);
    return "p then方法第二次返回";
  })
  .then(p2)
  .then(function(res) {
    console.log("p2的结果：" + res);
  });
```

### 加入 reject

我按照正常思路这么写的时候发现出了点问题，因为按照最上面的规范。即使一个 promise 被 rejected，他注册的 then 方法之后再注册的 then 方法会可能继续执行 resolve 的。即我们在 then 方法中为了链式返回的 this 的 status 是可能会被改变的，假设我们在实现中来改变状态而不暴露出来(这其实一点并不推荐)。

我直接贴实现的代码，还有注释作为讲解

```javascript
function Promise(fn) {
  var state = "pending";
  var doneList = [];
  var failList = [];
  this.then = function(done, fail) {
    switch (state) {
      case "pending":
        doneList.push(done);
        //每次如果没有推入fail方法，我也会推入一个null来占位
        failList.push(fail || null);
        return this;
        break;
      case "fulfilled":
        done();
        return this;
        break;
      case "rejected":
        fail();
        return this;
        break;
    }
  };
  function resolve(newValue) {
    state = "fulfilled";
    setTimeout(function() {
      var value = newValue;
      for (var i = 0; i < doneList.length; i++) {
        var temp = doneList[i](value);
        if (temp instanceof Promise) {
          var newP = temp;
          for (i++; i < doneList.length; i++) {
            newP.then(doneList[i], failList[i]);
          }
        } else {
          value = temp;
        }
      }
    }, 0);
  }
  function reject(newValue) {
    state = "rejected";
    setTimeout(function() {
      var value = newValue;
      var tempRe = failList[0](value);
      //如果reject里面传入了一个promise，那么执行完此次的fail之后，将剩余的done和fail传入新的promise中
      if (tempRe instanceof Promise) {
        var newP = tempRe;
        for (i = 1; i < doneList.length; i++) {
          newP.then(doneList[i], failList[i]);
        }
      } else {
        //如果不是promise，执行完当前的fail之后，继续执行doneList
        value = tempRe;
        doneList.shift();
        failList.shift();
        resolve(value);
      }
    }, 0);
  }
  fn(resolve, reject);
}
var p = function() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject("p 的结果");
    }, 100);
  });
};
var p2 = function(input) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      console.log("p2拿到前面传入的值：" + input);
      resolve("p2的结果");
    }, 100);
  });
};
p()
  .then(
    function(res) {
      console.log("p的结果:" + res);
      return "p then方法第一次返回";
    },
    function(value) {
      console.log(value);
      return "p then方法第一次错误的返回";
    }
  )
  .then(function(res) {
    console.log("p第一次then方法的返回：" + res);
    return "p then方法第二次返回";
  })
  .then(p2)
  .then(function(res) {
    console.log("p2的结果：" + res);
  });
```

用图片展示一下思路的话可能会更清晰些：

then 方法的初始化过程很简单：

<img alt="" width='500px' src="pics//my-then.png" />

执行时的过程是这样的：

<img alt="" width='700px' src="pics//my-resolve.png" />

正常思路的解决方案基本就是这样了

### 另外的套路

看的一篇美团工程师的博文，解决思路是每次 then 方法返回的都是一个新的 promise，这样其实对于规范来说是最准确的，因为这样子我们就不需要改变 promise 的状态了。

```javascript
function Promise(fn) {
  var state = "pending";
  var doneLists = [];
  this.then = function(done) {
    return new Promise(function(resolve) {
      handle({
        done: done || null,
        resolve: resolve
      });
    });
  };
  function resolve(newValue) {
    if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
      var then = newValue.then;
      if (typeof then === "function") {
        then.call(newValue, resolve);
        return;
      }
    }
    state = "fulfilled";
    value = newValue;
    setTimeout(function() {
      doneLists.forEach(function(deferred) {
        handle(deferred);
      });
    }, 0);
  }
  function handle(deferred) {
    if (state === "pending") {
      doneLists.push(deferred);
      return;
    }
    var ret = deferred.done(value);
    deferred.resolve(ret);
  }
  fn(resolve);
}
var p = function() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve("p 的结果");
    }, 100);
  });
};
p()
  .then(
    function(res) {
      console.log("p的结果:" + res);
      return "p then方法第一次返回";
    },
    function(value) {
      console.log(value);
      return "p then方法第一次错误的返回";
    }
  )
  .then(function(res) {
    console.log("p第一次then方法的返回：" + res);
    return "p then方法第二次返回";
  });
```

这个思路就是说：

- 调用 Promise a 的 then 方法会创建一个 Promise b,然后将参数 done 和 b 的 resolve 方法作为对象推入 a 的 doneLists 数组中；
- 然后处理顺序就是遍历 a 的 doneLists 时，执行 done，然后调用 b 的 resolve；
- 这样 then 如果传入的是一个执行之后是 promise 的方法，就在上一层 resolve 时再用.then 方法包装一环；

then 方法的运行图像就像是这样的：

 <img alt="" width='600px' src="pics//m-then.png" />

执行过程就像是下面这样：

<img alt="" width='800px' src="pics//m-resolve.png" />

### 其他的思路

tudo:待定

参考：

- [PromiseA+的规范](https://promisesaplus.com/)
- http://tech.meituan.com/promise-insight.html
