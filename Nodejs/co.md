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

## generator函数的流程管理
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



co帮我们不停地调用传入生成器的next函数，如果done为true的时候，代表迭代完成，会将值传给回调函数。



todu：有个好处是可以使用try catch来捕捉错误了？？？
