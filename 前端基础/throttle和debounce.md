# throttle和debounce
这两个都是处理密集调用的函数，看高级程序设计614页的时候，发现写的有问题，书里将throttle和debounce搞混了。于是重新整理了一下。

## 意义解释
throttle这个是在高频调用时，保证多少毫秒内只会被执行一次，还是会不断地触发，但是限制了频率。

特别适合的场景：比如在resize触发的时候，页面会被不停地重绘，如果在resize里面还加上了DOM操作的话，对于浏览器的压力很大。设置了throttle之后，就可以设置成50ms触发一次重绘。

debounce是在多少毫秒内不再被触发的时候，就会执行一次，如果不停的调用的话，他实际上最后其实只是执行一次。比如在线编辑的自动存储，比较适合这种处理的逻辑。

## 自己实现throttle
自己根据特性简单的实现了一下
```javascript
function throttle(fn, timeout, context){
  //如果上次没调用过，直接调用
  if(!fn.lastExec){
    fn.lastExec = Date.now();
    fn.call(context);
  }else{
    //如果调用过 --- 如果这次的调用时间超过了设置的设定好的timeout
    var remaining = Date.now() - fn.lastExec;
    if(remaining > timeout){
      //新调用
      fn.lastExec = Date.now();
      fn.call(context);
    }
  };
}
var fn = function(){console.log(Date.now())}
for(var i = 1;i<=10;i++){
  setTimeout(function(){
    throttle(fn,2000);
  },1000*i);
}
function debounce(fn, timeout ,context){
  //如果上次调用过还没执行，就清除掉，重设定时
  clearTimeout(fn.dId);
  fn.dId = setTimeout(function(){
    fn.call(context);
  },timeout);
}
```

我写的throttle的函数的缺陷：

 - 我的节流会根据调用的频率产生误差，频率越小，我的误差会越大，因为我只是阻止了时间内的调用，并没有为了他再设置一个定时器
 - 我把数据都直接挂在了fn上，太Low了，应该用一个闭包，把数据存在内存中，并且外部也没有访问的可能


## underscore的实现throttle
顺便去看下别人的模块是怎么写的

```javascript
_.throttle = function(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : _.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  var throttled = function() {
    var now = _.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    //如果剩余时间小于0，清空timeout，立即调用
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      //如果没有timeout并且不禁止最后一次调用，那就设置定时重新运行
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
};
var fn = _.throttle(function(){console.log(Date.now())},2000);
for(var i = 1;i<10;i++){
  setTimeout(fn,1000*i);
}
```

underscore的实现解决了我的调用的误差问题，如果时间到了，直接执行；时间不到，就设置一个剩余时间的定时器来执行。很有意思的实现。

## 自己实现debounce
```javascript
function debounce(fn, timeout ,context){
  //如果上次调用过还没执行，就清除掉，重设定时
  clearTimeout(fn.dId);
  fn.dId = setTimeout(function(){
    fn.call(context);
  },timeout);
}
var fn = function(){console.log(Date.now())}
for(var i = 1;i<=5;i++){
  setTimeout(function(){
    debounce(fn,2000,null);
  },1000*i);
}
```

debounce的实现比较简单，应该也不会错。除了没用闭包，有些low之外。

## underscore的实现debounce
```javascript
_.debounce = function(func, wait, immediate) {
  var timeout, result;
  var later = function(context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };
  var debounced = restArgs(function(args) {
    var callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    if (callNow) {
      //如果立即调用，就设置一个定时，并且调用下方法。
      timeout = setTimeout(later, wait);
      result = func.apply(this, args);
    } else if (!immediate) {
      //否则，更新定时的时间
      timeout = _.delay(later, wait, this, args);
    }
    return result;
  });
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
};
```

 - 他的实现主要是加上了immediate的支持，就是在第一次调用的时候直接执行，并且在接下来的时间内不会再执行。用于防止那种不小心提交按钮点击了两次的情况是很管用的。
 - 而且他的实现都提供了cancel方法来清除定时，防止出问题，蛮好的。
