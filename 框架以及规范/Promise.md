# Promise
看了些promise的介绍，但是还是感觉不够深入，这个在解决异步问题上是一个很好的解决方案，所以详细看一下。

## Promise/A+规范：
 - 重新阅读了下A+的[规范](https://promisesaplus.com/):
   - promise代表了一个异步操作的最终结果，主要是通过then方法来注册成功以及失败的情况，
   - Promise/A+历史上说是实现了Promise/A的行为并且考虑了一些不足之处，他并不关心如何创建，完成，拒绝Promise，只考虑提供一个可协作的then方法。

### 术语：
   - `promise`是一个拥有符合上面的特征的then方法的对象或者方法。
   - `thenable`是定义了then方法的对象或者方法
   - `value`是任何合法的js的值（包括undefined，thenable或者promise）
   - `exception`是一个被throw申明抛出的值
   - `reason`是一个指明了为什么promise被拒绝

### 2.1 状态要求：
   - promise必须是在pending，fulfilled或者rejected之间的一种状态。
   - promise一旦从pending变成了fulfilled或则rejected，就不能再改变了。
   - promise变成fulfilled之后，必须有一个value，并且不能被改变
   - promise变成rejected之后，必须有一个reason，并且不能被改变

### 2.2 then方法的要求：
   - promise必须有个then方法来接触当前的或者最后的value或者reason
   - then方法接受两个参数，onFulfilled和onRejected，这两个都是可选的，如果传入的不是function的话，就会被忽略
   - 如果onFulfilled是一个函数，他必须在promise完成后被执行(不能提前)，并且value是第一个参数，并且不能被执行超过一次
   - 如果onRejected是一个函数，他必须在promise拒绝后被执行(不能提前)，并且reason是第一个参数，并且不能被执行超过一次
   - onFulfilled或者onRejected只能在执行上下文堆只包含了平台代码的时候执行(就是要求onfulfilled和onrejected必须异步执行，必须在then方法被调用的那一轮事件循环之后的新执行栈执行，这里可以使用macro-task或者micro-task，这两个的区别参见[文章](https://github.com/panyifei/learning/blob/master/前端基础/Macro-task与Micro-task.md))
   - onFulfilled或者onRejected必须作为function被执行(就是说没有一个特殊的this，在严格模式中，this就是undefined，在粗糙的模式，就是global)
   - then方法可能在同一个promise被调用多次，当promise被完成，所有的onFulfilled必须被顺序执行，onRejected也一样
   - then方法必须也返回一个promise(这个promise可以是原来的promise，实现必须申明什么情况下两者可以相等)promise2 = promise1.then(onFulfilled, onRejected);
    - 如果`onFulfilled`和`onRejected`都返回一个value x，执行2.3Promise的解决步骤[[Resolve]](promise2, x)
    - 如果`onFulfilled`和`onRejected`都抛出exception e，promise2必须被rejected同样的e
    - 如果`onFulfilled`不是个function，且promise1 is fulfilled，promise2也会fulfilled，和promise1的值一样
    - 如果`onRejected`不是个function，且promise1 is rejected，promise2也会rejected，理由和promise1一样

  这里不论promise1被完成还是被拒绝，promise2 都会被 resolve的，只有出现了一些异常才会被rejected

###2.3Promise的解决步骤==[[Resolve]](promise2, x)
 - 这个是将`promise`和一个值`x`作为输入的一个抽象操作。如果这个x是支持then的，他会尝试让promise接受x的状态；否则，他会用x的值来fullfill这个promise。运行这样一个东西，遵循以下的步骤
  - 如果promise和x指向同一个对象，则reject这个promise使用TypeError。
  - 如果x是一个promise，接受他的状态
   - 如果x在pending，promise必须等待x的状态改变
   - 如果x被fullfill，那么fullfill这个promise使用同一个value
   - 如果x被reject，那么reject这个promise使用同一个理由
  - 如果x是一个对象或者是个方法
   - 如果x.then返回了错误，则reject这个promise使用错误。
   - 如果then是一个方法，使用x为this，resolvePromise为一参，rejectPromise为二参，
    - 如果resolvePromise被一个值y调用，那么运行[[Resolve]](promise, y)
    - 如果rejectPromise被reason r，使用r来reject这个promise
    - 如果resolvePromise和rejectPromise都被调用了，那么第一个被调用的有优先权，其他的beihulue
    - 如果调用then方法得到了exception，如果上面的方法被调用了，则忽略，否则reject这个promise
   - 如果then方法不是function，那么fullfill这个promise使用x
  - 如果x不是一个对象或者方法，那么fullfill这个promise使用x

如果promise产生了环形的嵌套，比如[[Resolve]](promise, thenable)最终唤起了[[Resolve]](promise, thenable)，那么实现建议且并不强求来发现这种循环，并且reject这个promise使用一个TypeError。

## 写一个promise
想要写一个Promise，肯定得使用一个异步的函数，就拿setTimeout来做。
这里参考了美团的一篇[技术博客](http://tech.meituan.com/promise-insight.html)

```javascript
var p = new Promise(function(resolve){
    setTimeout(resolve, 100);
});
p.then(function(){console.log('success')},function(){console.log('fail')});
```

上面是个最简单的使用场景我们需要慢慢来构建

```javascript
function Promise(fn){
  //需要一个成功时的回调
  var fulfillCallback;
  //一个实例的方法，用来注册异步事件
  this.then = function(done){
    fulfillCallback = done;
  }
  function resolve(){
    fulfillCallback();
  }
  fn(resolve);
}
```

下面加入rejected状态的情况

```javascript
function Promise(fn){
  //需要成功以及成功时的回调
  var fulfillCallback,rejectedCallback;
  //一个实例的方法，用来注册异步事件
  this.then = function(done ,fail){
    fulfillCallback = done;
    rejectedCallback = fail;
  }
  function resolve(){
    fulfillCallback();
  }
  function reject(){
    rejectedCallback();
  }
  fn(resolve,reject);
}
```

下面加入链式，成功回调以及失败的回调就得变成数组

```javascript
function Promise(fn){
  //需要成功以及成功时的回调
  var fulfillCallbackList = [];
  var rejectedCallbackList= [];
  //一个实例的方法，用来注册异步事件
  this.then = function(done ,fail){
    fulfillCallbackList.push(done);
    rejectedCallbackList.push(fail);
    return this;
  }
  function resolve(){
    fulfillCallbackList.forEach(function(fulfill){
      fulfill();
    });
  }
  function reject(){
    rejectedCallbackList.forEach(function(fail){
      fail();
    });
  }
  fn(resolve,reject);
}
```

这里promise里面如果是同步的函数的话，fulfillCallbackList里面还是空的，所以可以加个setTimeout来将这个放到js的最后执行。这里主要是参照了promiseA+的规范，就像这样

```javascript
function resolve(){
  setTimeout(function(){
    fulfillCallbackList.forEach(function(fulfill){
      fulfill();
    });
  },0);
}
```

这时如果promise已经执行完了，我们再给promise注册then方法就怎么都不会执行了，这个不符合预期，所以才会加入状态这种东西。更新过的代码如下

```javascript
function Promise(fn){
  //需要成功以及成功时的回调
  var state = 'pending';
  var fulfillCallbackList = [];
  var rejectedCallbackList= [];
  //一个实例的方法，用来注册异步事件
  this.then = function(done ,fail){
    switch(state){
      case "pending":
        fulfillCallbackList.push(done);
        rejectedCallbackList.push(fail);
        return this;
        break;
      case 'fulfilled':
        done();
        return this;
        break;
      case 'rejected':
        fail();
        return this;
        break;
    }
  }
  function resolve(){
    state = "fulfilled";
    setTimeout(function(){
      fulfillCallbackList.forEach(function(fulfill){
        fulfill();
      });
    },0);
  }
  function reject(){
    state = "rejected";
    setTimeout(function(){
      rejectedCallbackList.forEach(function(fail){
        fail();
      });
    },0);
  }
  fn(resolve,reject);
}
```

现在的写法根本没有考虑异步返回的结果的传递，我们来加上结果的传递

```javascript
function resolve(newValue){
  state = "fulfilled";
  setTimeout(function(){
    fulfillCallbackList.forEach(function(fulfill){
      fulfill(newValue);
    });
  },0);
}
```

但是这里的问题来了，我们的结果每次给的都是同一个的值，这里肯定要重新像个解决方法

参考：

 - [PromiseA+的规范](https://promisesaplus.com/)
 - http://tech.meituan.com/promise-insight.html
