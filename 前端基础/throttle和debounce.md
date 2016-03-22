# throttle和debounce
这两个都是处理密集调用的函数，看高级程序设计614页的时候，发现写的有问题，书里将throttle和debounce搞混了。于是重新整理了一下。

## 意义解释
throttle这个是在高频调用时，保证多少毫秒内只会被执行一次，还是会不断地触发，但是限制了频率。

特别适合的场景：比如在resize触发的时候，页面会被不停地重绘，如果在resize里面还加上了DOM操作的话，对于浏览器的压力很大。设置了throttle之后，就可以设置成50ms触发一次重绘。

debounce是在多少毫秒内不再被触发的时候，就会执行一次，如果不停的调用的话，他实际上最后其实只是执行一次。比如在线编辑的自动存储，比较适合这种处理的逻辑。

## 自己实现
自己根据特性简单的实现了一下
```javascript
function throttle(fn, timeout, context){
  //如果上次没调用过，直接调用
  if(!fn.lastExec){
    fn.lastExec = Date.now();
    fn.call(context);
  }else{
    //如果调用过 --- 如果这次的调用时间超过了设置的设定好的timeout
    if((Date.now() - fn.lastExec) > timeout){
      fn.lastExec = Date.now();
      fn.call(context);
    }
  };
}
function debounce(fn, timeout ,context){
  //如果上次调用过还没执行，就清除掉，重设定时
  clearTimeout(fn.dId);
  fn.dId = setTimeout(function(){
    fn.call(context);
  },timeout);
}
```

## underscore的实现
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
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
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
```
