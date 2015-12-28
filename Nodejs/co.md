# co
tj大神的co，将本来应该是一个数据类型的generator变成了一种处理异步的解决方案

其实主要就是一个遍历函数，将promise或者generator的异步函数一直执行到得到最后的结果再返回，这样就可以把本来放到异步中的方法按照同步的顺序来写。

## yield
函数内部的yield后面传入的可以是以下

- Promise(就是promise嘛)
- thunks(就是一个偏函数，执行之后只有一个简单的拥有一个callback的参数的函数)
- array(通过array可以并行执行里面的function)
- objects(和array相同，也是并行执行里面的yieldable)
- generators
- generators functions(下面的这两个东西可以支持，但是并不被推荐，因为我们应该转向更加标准的promise)

## API
### co(fn*).then
将一个generator解决为一个promise

### var fn = co.wrap(fn*)
讲一个generator转化为一个返回promise的常规函数

## 本质的探索
他的最初实现是基于Thunk函数的。接收了一个生成器函数作为参数，并生成了一个实际操作函数，函数通过接收回调的方式来传入最后的返回值。

## 所以先了解下thunk函数
这东西的发展是由函数的求值策略的分歧决定的，两种求值策略

```javascript
  var b = 1;
 function a(x,y){
   return y;
 }
 a(b+1);
```

上面的代码一`b+1`在什么时候执行比较好，

一种是传值调用，在进入函数体之前就直接执行完，把值传进去。c语言是这么做的

一种是传名调用，将表达式传入函数体，只在用到他的时候求值。Hskell语言是这么做的

前一种会简单一些，但是会有性能损失，所以倾向于传名调用。

传名函数的编译器实现，其实就是放入一个临时函数，再将临时函数传入函数体，这个临时函数就叫做thunk函数。

js语言是传值调用，他的thunk含义有些不同，js中，thunk函数替换的不是表达式，而是多参数函数，将它替换成单参数的版本，且只接受回调函数作为参数。

```javascript
  //正常的readFile函数
  fs.readFile(fileName, callback);
  var readFileThunk = Thunk(fileName);
  readFileThunk(callback);
  //thunk版本的函数
  function Thunk(fileName){
    return function(callback){
      fs.readFile(fileName,callback);
    }
  }
```

所以其实任何有回调的函数都是可以搞成thunk形式的，下面是一个简单的生成器

```javascript
  var Thunk = function(fn){
    return function () {
      //先传入其他的参数初始化
      var args = Array.prototype.slice.call(arguments);
      //传入callback返回的函数
      return function(callback){
        args.push(callback);
        //实际调用的时候
        return fn.apply(this,args);
      }
    }
  }
  var readFileThunk = Thunk(fs.readFile);
  readFileThunk(fileA)(callback);
```

tj的thunkify源码
```javascipt
/**
 * Module dependencies.
 */
var assert = require('assert');
/**
 * Expose `thunkify()`.
 */
module.exports = thunkify;
/**
 * Wrap a regular callback `fn` as a thunk.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */
function thunkify(fn){
  assert('function' == typeof fn, 'function required');
  return function(){
    //这里就是将所有的参数放进了一个新的数组，这里之所以不用[].slice。是因为有人在bluebird docs发现，如果直接这样泄露arguments，v8的一些优化的编译会被搁置，就会有性能上的损失。
    var args = new Array(arguments.length);
    var ctx = this;
    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }
    return function(done){
      //这里用called是为了标记只执行了一次，类似于promise的resolve和reject只能执行一次一样。
      var called;
      args.push(function(){
        if (called) return;
        called = true;
        //因为arguments是一个list，必须得用apply才能在done传入。
        done.apply(null, arguments);
      });
      //这里用个try catch，可以在执行失败时走一遍callback，传入err信息
      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};
```

<img alt="不用slice处理arguments" width='700px' src="pics//pic1.png" />

<img alt="为了使回调函数只执行一次" width='700px' src="pics//pic2.png" />

## generator函数的回调流程管理
包装成这样到底有个啥用场？用在了generator的流程管理

```javascript
var fs = require('fs');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);
var gen = function* (){
  var r1 = yield readFile('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFile('/etc/shells');
  console.log(r2.toString());
};
var g = gen();
var r1 = g.next();
r1.value(function(err, data){
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function(err, data){
    if (err) throw err;
    g.next(data);
  });
});
```

就如同上面的，generator的执行过程实际上是将同一个回调函数，反复传入next的value结果中。这样我们就可以递归的来自动完成这个过程了。于是据诞生了基于thunk函数的执行器，也就是co了。

## 最简单的co
```javascipt
function run(fn) {
  var gen = fn();
  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }
  next();
}
run(gen);
```

执行器帮我们不停地调用传入生成器的next函数，如果done为true的时候，代表迭代完成，会将值传给回调函数。

当然前提是每一个一步函数都得是thunk函数的形式。

thunk并不是generator函数的自动执行的唯一方案。我们需要的其实只是一个机制，循环调用，并且交出和返回程序的执行权，thunk可以做到，promise也可以做到。

首先将readfile包装成promise形式
```javascript
var fs =require('fs');
var readFile  = function(fileName){
  return new Promise(function(resolve,reject){
    fs.readFile(fileName,function(error,data){
      if(error){reject(error)}
      resolve(data);
    })
  });
}
var gen = function* (){
  var f1 = yield readFile('f1.js');
  var f2 = yield readFile('f2.js');
  console.log(f1);
  console.log(f2);
}
```

然后手动执行下generator函数

```javascipt
var g = gen();
g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
})
```

写一个自动执行器

```javascipt
function run(gen){
  var g = gen();
  function next(data){
    var result = g.next(data);
    if(result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }
  next();
}
```

## co的源码

下面的是co源码的逐行阅读，先把参照的一些图片列举出来

### 图片3
<img alt="处理es6模块的引入" width='700px' src="pics//pic3.png" />

```javascipt
  //array原生的slice
  var slice = Array.prototype.slice;
  //这里写的这么古怪就只是想在es6的模块引入时更加舒服一些，参见上面的图片3
  module.exports = co['default'] = co.co = co;
  //将传入的generator函数包装成一个返回promise的方法
  //这是一个独立的方法，就是将传入的函数包装成了co执行前的形式
  co.wrap = function (fn) {
    //存了一个指针指向原generator函数
    createPromise.__generatorFunction__ = fn;
    return createPromise;
    function createPromise() {
      //返回的方法调用就会直接执行co。
      return co.call(this, fn.apply(this, arguments));
    }
  };
  //执行generator或者generator函数然后返回一个promise
  function co(gen) {
    var ctx = this;
    var args = slice.call(arguments, 1)
    // 将所有的东西放到一个promise里面，来防止引起内存泄露错误的promise chaining。
    //tudo：看一下这个issue see https://github.com/tj/co/issues/180
    //https://github.com/promises-aplus/promises-spec/issues/179 看的我好累，完全没有看懂啊！！！
    return new Promise(function(resolve, reject) {
      if (typeof gen === 'function') gen = gen.apply(ctx, args);
      if (!gen || typeof gen.next !== 'function') return resolve(gen);
      onFulfilled();
      /**
       * @param {Mixed} res
       * @return {Promise}
       * @api private
       */
      function onFulfilled(res) {
        var ret;
        try {
          ret = gen.next(res);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }
      /**
       * @param {Error} err
       * @return {Promise}
       * @api private
       */
      function onRejected(err) {
        var ret;
        try {
          ret = gen.throw(err);
        } catch (e) {
          return reject(e);
        }
        next(ret);
      }
      /**
       * Get the next value in the generator,
       * return a promise.
       *
       * @param {Object} ret
       * @return {Promise}
       * @api private
       */
      function next(ret) {
        if (ret.done) return resolve(ret.value);
        var value = toPromise.call(ctx, ret.value);
        if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
        return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
          + 'but the following object was passed: "' + String(ret.value) + '"'));
      }
    });
  }
  /**
   * Convert a `yield`ed value into a promise.
   *
   * @param {Mixed} obj
   * @return {Promise}
   * @api private
   */
  function toPromise(obj) {
    if (!obj) return obj;
    if (isPromise(obj)) return obj;
    if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
    if ('function' == typeof obj) return thunkToPromise.call(this, obj);
    if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
    if (isObject(obj)) return objectToPromise.call(this, obj);
    return obj;
  }
  /**
   * Convert a thunk to a promise.
   *
   * @param {Function}
   * @return {Promise}
   * @api private
   */
  function thunkToPromise(fn) {
    var ctx = this;
    return new Promise(function (resolve, reject) {
      fn.call(ctx, function (err, res) {
        if (err) return reject(err);
        if (arguments.length > 2) res = slice.call(arguments, 1);
        resolve(res);
      });
    });
  }
  /**
   * Convert an array of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Array} obj
   * @return {Promise}
   * @api private
   */
  function arrayToPromise(obj) {
    return Promise.all(obj.map(toPromise, this));
  }
  /**
   * Convert an object of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Object} obj
   * @return {Promise}
   * @api private
   */
  function objectToPromise(obj){
    var results = new obj.constructor();
    var keys = Object.keys(obj);
    var promises = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var promise = toPromise.call(this, obj[key]);
      if (promise && isPromise(promise)) defer(promise, key);
      else results[key] = obj[key];
    }
    return Promise.all(promises).then(function () {
      return results;
    });
    function defer(promise, key) {
      // predefine the key in the result
      results[key] = undefined;
      promises.push(promise.then(function (res) {
        results[key] = res;
      }));
    }
  }
  /**
   * Check if `obj` is a promise.
   *
   * @param {Object} obj
   * @return {Boolean}
   * @api private
   */
  function isPromise(obj) {
    return 'function' == typeof obj.then;
  }
  /**
   * Check if `obj` is a generator.
   *
   * @param {Mixed} obj
   * @return {Boolean}
   * @api private
   */
  function isGenerator(obj) {
    return 'function' == typeof obj.next && 'function' == typeof obj.throw;
  }
  /**
   * Check if `obj` is a generator function.
   *
   * @param {Mixed} obj
   * @return {Boolean}
   * @api private
   */
  function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    if (!constructor) return false;
    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
  }
  /**
   * Check for plain object.
   *
   * @param {Mixed} val
   * @return {Boolean}
   * @api private
   */
  function isObject(val) {
    return Object == val.constructor;
  }
```




todu：有个好处是可以使用try catch来捕捉错误了？？？
