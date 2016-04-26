## setTimeout
setTimeout作为一个定时器函数，比较简单，主要是他的一些细节进行总结。

### 主要是两种传参
一种是传入func，这种可以通过传第三个参数，第四个...来给传入的function传参数(但是得在IE9往后才支持)，例如：

```javascript
setTimeout(function (a,b){
  console.log(a,b);
},1000,1,2);
```

一种是传入code，这种内部实现其实是调用了eval方法，并不推荐，而且不支持传入多个参数，例如：

```javascript
setTimeout('console(1)',1000);
```

### 第一种传参也有些问题
#### 函数绑定的问题
就是有传入一个匿名函数还是传入一个函数指针的问题。首先是函数绑定的问题：

```javascript
function User(){
  this.x = '1';
  this.y = function(){
    console.log(this.x);
  }
}
var user = new User();
setTimeout(user.y,1000);
setTimeout(function(){
  user.y();
},1000);
```

这个时候的调用的user.y实际上是在全局调用的，就会返回undefined，下面的匿名函数才可以拿到正确的值。

#### 作用域的问题
```javascript
var x = 12;
var time = function(a){console.log(x);console.log(a)}
function aa(){
  var x = 13;
  setTimeout(function(a){console.log(x);console.log(a)},100,12);
  setTimeout(time,100,12);
}
aa();
```

这不是setTimeout的问题，这个是变量提升的问题，就是说函数的作用域只在他是在那里定义的，与在那里调用无关。

#### 性能问题
先申明再调用比直接匿名函数的性能要好，毕竟先声明的话，在预编译阶段就开始执行了，会有性能的提升。

## 与setInterval的比较
我们经常会用setTimeout来代替setInterval，原因是setTimeout我们可以保证两次执行的间隔肯定是长于我们设置的值的。但是setInterval不能保证，可能会短于我们设置的时间

因为setInterval会每个一段时间尝试执行一次回调，但是如果现在队列中有存在的未执行的事件，本次尝试的调用就会被抛弃。也就是说如果UI队列已经存在同一个setInterval创建的任务，那么后续任务不会被添加到UI队列中。
