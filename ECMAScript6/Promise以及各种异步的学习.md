# Promise以及各种异步的学习
Promise是一个对象，用来传递异步操作，代表了某个未来才会知道的结果
两个特点：
     只有异步操作的结果可以决定对像的哪种状态，包括pending，resolved，rejected，外界无法对它造成影响
     一旦状态改变了，就会维持这个结果不会再变，你可以一直拿到这个结果

有了promise，可以将一些异步操作以同步的形式保存下来，避免了层层嵌套

promise的缺点在于：
     无法取消，
     不设置回调，内部的错误就无法反映到外部
     pending状态很长，我们不知道是即将完成还是刚刚开始

不断重复发生，可以用stream模式

var promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});

生成一个promise对象
实例生成过后

promise.then(function(value) {
  // success
}, function(value) {
  // failure
});

用then来申明成功和失败的处理

function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}

timeout(100).then((value) => {
  console.log(value);
});

这个例子还是看得懂的，就是return的promise里面有个定时器，时间到了执行成功，将‘done’传进去，然后用then来搞定resolved，输出传入的value

异步加载图片的看得懂，就是在onload和onerror事件的时候调用resolved和reject，ajax也是差不多，就是在监听statuscode的时候区分调用resolved和reject

注意resolve函数的参数除了正常的值之外还有可能是一个promise对象
这里再稍微研究一下？

then对象返回的是一个新的promise的实例
所以可以采用链式的写法，在then之后再调用then

在后面的catch可以捕获到错误
注意catch返回的还是一个promise

var p = Promise.all([p1,p2,p3]);

此时，必须全成功才会成功，有一个失败了就失败了

var p = Promise.race([p1,p2,p3]);

有一个改变了状态，p的状态就跟着变，然后他的值会传递给p的回调

Promise.resolve()
这个方法将现有的对象装化为promise对象，可不带参数
就是看有没有then方法，如果没有，直接就是状态为resolved的promise，如果有，那就好办了

Promise.reject()
直接得到rejected状态的promise对象

异步的四种：
1.回调
2.事件监听
3.发布/订阅
4.Promise对象

1最以前就是回调函数了，但是一层层的写，很容易callback hell
4所以promise可以把代码写成纵向的加载，最大的问题，代码冗余，无论什么，被包装了都是一堆的then
generator函数就是将控制权抛了出去