# Promise
看了些promise的介绍，但是还是感觉不够深入，这个在解决异步问题上是一个很好的解决方案，所以详细看一下。

## Promise/A+规范：
 - 重新阅读了下A+的[规范](https://promisesaplus.com/):
   - promise代表了一个异步操作的最终结果，主要是通过then方法来注册成功以及失败的情况，
   - Promise/A+历史上说是实现了Promise/A的行为并且考虑了一些不足之处，他并不关心如何创建，完成，拒绝Promise，只考虑提供一个可协作的then方法。
 - 术语：
   - `promise`是一个拥有符合上面的特征的then方法的对象或者方法。
   - `thenable`是定义了then方法的对象或者方法
   - `value`是任何合法的js的值（包括undefined，thenable或者promise）
   - `exception`是一个被throw申明抛出的值
   - `reason`是一个指明了为什么promise被拒绝
 - 2.1 状态要求：
   - promise必须是在pending，fulfilled或者rejected之间的一种状态。
   - promise一旦从pending变成了fulfilled或则rejected，就不能再改变了。
   - promise变成fulfilled之后，必须有一个value，并且不能被改变
   - promise变成rejected之后，必须有一个reason，并且不能被改变
 - 2.2 then方法的要求：
   - promise必须有个then方法来接触当前的或者最后的value或者reason
   - then方法接受两个参数，onFulfilled和onRejected，这两个都是可选的，如果传入的不是function的话，就会被忽略
   - 如果onFulfilled是一个函数，他必须在promise完成后被执行(不能提前)，并且value是第一个参数，并且不能被执行超过一次
   - 如果onRejected是一个函数，他必须在promise拒绝后被执行(不能提前)，并且reason是第一个参数，并且不能被执行超过一次
   - onFulfilled或者onRejected只能在执行上下文堆只包含了平台代码的时候执行(tudo:??)
   - onFulfilled或者onRejected必须作为function被执行(tudo:??)
   - then方法可能在同一个promise被调用多次，当promise被完成，所有的onFulfilled必须被顺序执行，onRejected也一样
   - then方法必须也返回一个promise(这个promise可以是原来的promise，实现必须申明什么情况下两者可以相等)promise2 = promise1.then(onFulfilled, onRejected);
    - 如果onFulfilled和onRejected都返回一个value x，执行2.3Promise的解决步骤
    - 如果onFulfilled和onRejected都抛出exception e，promise2必须被rejected同样的e
    - 如果onFulfilled不是个function，且promise1 is fulfilled，promise2也会fulfilled，和promise1的值一样
    - 如果onRejected不是个function，且promise1 is rejected，promise2也会rejected，理由和promise1一样
 - 2.3Promise的解决步骤
   - 这个就是






## 写一个promise
想要写一个Promise，肯定得使用一个异步的函数，就拿setTimeout来做。

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

这里promise里面如果是同步的函数的话，fulfillCallbackList里面还是空的，所以可以加个setTimeout来将这个放到js的最后执行。就像这样

```javascript
function resolve(){
  setTimeout(function(){
    fulfillCallbackList.forEach(function(fulfill){
      fulfill();
    });
  },0);
}
```

因为promise只有3种状态，并且在完成或者失败之后不会再改变，所以加入状态


参考：

[PromiseA+的规范](https://promisesaplus.com/)
