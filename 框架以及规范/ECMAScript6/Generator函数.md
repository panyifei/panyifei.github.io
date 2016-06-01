---
layout: default
title: {{ site.name }}
---
# Generator函数
Generator是一个状态机，封装了多个内部状态。

执行这个函数会返回一个遍历器对象，可以一次遍历Generator函数内部的每一个状态。

## 形式：

- `function`与函数名之间有一个星号
- 函数内部使用`yield`语句，定义不同的内部状态

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
var hw = helloWorldGenerator();
```

这个函数有三个状态，hello,world和return语句

### 调用：next方法

```javascript
hw.next()
// { value: 'hello', done: false }
hw.next()
// { value: 'world', done: false }
hw.next()
// { value: 'ending', done: true }
hw.next()
// { value: undefined, done: true }
```

每调用一次`next`，就会从头部或者上一次停下来的地方开始执行，直到下一个yield或者return。

value代表了yield语句的值，done属性代表是否结束，可以一直的运行，最后的结果会一直是{ value: undefined, done: true }。

`yield`语句比`return`多了个记忆的过程，每次遇到都会暂停执行，下次再从该位置继续向后执行。

- 可以没有`yield`，就会简单地当做一个延时的函数
- 普通函数不能使用`yield`


```javascript
var arr = [1, [[2, 3], 4], [5, 6]];
var flat = function* (a){
  a.forEach(function(item){
    if (typeof item !== 'number'){
      yield* flat(item);
    } else {
      yield item;
    }
  }
};
for (var f of flat(arr)){
  console.log(f);
}
```

这样子使用也是不行的，这样子也是在普通函数中

- `yield`语句如果在表达式当中，必须放在圆括号里面

```javascript
console.log('Hello' + (yield)); // OK
```

#### next方法的参数
yield句本来没有返回值。我们可以通过给next方法带上一个参数，这个参数就会是上一个yield语句的返回值。

```javascript
function* f() {
  for(var i=0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}
var g = f();
g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

前两次都是undefined，第三次调用使得reset变成了true。

- 在函数运行之后，继续向函数内部注入值，可以在函数运行的不同阶段，从外部注入不同的值，从而调整函数行为。
- next方法传入的是上一个yield的返回值，于是在第一次使用next方法是，不能带有参数.V8引擎会直接忽略第一次的参数。如果想要第一次的话，就写个函数包装一下

```javascript
function wrapper(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  };
}
const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});
wrapped().next('hello!')
```

#### for..of循环
for...of可以自动遍历Generator函数

	如果next方法返回的done属性为true，则for...of终止，且不包含该返回对象。

```javascript
function *foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}
for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

这里承接了前面的章节，for..of,扩展运算符...,结构赋值和Array.from都是可以调用遍历器接口的，于是就可以像下面这样。

```javascript
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}
[...numbers()] // [1, 2]
Array.from(numbers()) // [1, 2]
let [x, y] = numbers();
x // 1
y // 2
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

这里还可以给原生的js对象遍历的接口


```javascript
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);
  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}
let jane = { first: 'Jane', last: 'Doe' };
for (let [key,value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

#### Generator.prototype.throw()
这个可以在函数体外抛出错误，然后再函数体内捕获

#### Generator.prototype.return()
这个方法可以返回给定的值，并且终止遍历

如果不提供参数，那么返回的value属性为undefined

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
var g = gen();
g.next()        // { value: 1, done: false }
g.return() // { value: undefined, done: true }
```

如果里面有finally方法，那么调用return就会直接执行finally里面，执行完了finally就会再执行return。

```javascript
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers()
g.next() // { done: false, value: 1 }
g.next() // { done: false, value: 2 }
g.return(7) // { done: false, value: 4 }
g.next() // { done: false, value: 5 }
g.next() // { done: true, value: 7 }
```

#### yield*语句
在Generator内部，遍历调用另一个Generator函数。可以使用yield语句，等同于在函数内部多部署了一个for...of循环

```javascript
function* foo() {
  yield 'a';
  yield 'b';
}
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}
for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

被代理的generator函数有return语句的话，就可以向代理的函数返回数据:

```javascript
function *foo() {
  yield 2;
  yield 3;
  return "foo";
}
function *bar() {
  yield 1;
  var v = yield *foo();
  console.log( "v: " + v );
  yield 4;
}
var it = bar();
it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```

#### 对象属性的generator函数
就是在作为对象的属性时，可以简写，以下的两种写法等价

```javascript
let obj = {
  * myGeneratorMethod() {
    ···
  }，
  myFunction: funciton* (){
  }
};
```

#### generator与状态机
generator是实现状态机的最佳结构，不依赖任何变量，无公害，写法优雅

```javascript
var clock = function*(_) {
  while (true) {
    yield _;
    console.log('Tick!');
    yield _;
    console.log('Tock!');
  }
};
```

#### generator与协程
协程是程序运行的方式，可以单线程，可以多线程。

###### 协程与子例程的差异

一般的子例程采用传统的‘后进新出’的执行方式，只有当调用的子函数完全执行完毕的时候，返回来执行父函数。

协程就是多个线程可以并行执行，但是只有线程或者函数处于正在运行的状态，其他都处于暂停态。线程之间交换执行权。这种并行执行，交换执行权的线程，就称为协程。

从内存看，子例程就是只是用一个栈，而协程则是同时存在多个栈，但是只有一个栈是运行状态。以多占用内存为代价，实现多任务的并行。

##### 协程与普通线程的差异

同一时间可以有多个线程处于运行状态，但是协程只能有一个在运行。普通的线程是抢先式的，但是协程是合作式的，执行权由自己分配。

协程的好处在于抛出错误的时候，可以找到原始的调用栈，而不至于像异步操作的回调一样，一旦出错，原始的调用栈早就结束。

generator是es6对协程的实现，但属于不完全实现，是‘半协程’，只有generator的调用者才能把程序的执行权交还给generator函数，如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。

我们可以将多个需要相互协作的任务写成generator函数，他们之间使用yield语句交换控制权。

##### 小思考
这次遇到的问题感觉generator也提供了一个结局的方案：

m站两个模块，初始化的时候相互依赖，最后则是我的先初始化，然后emit了一个自定义事件，然后在善成的模块初始化之后，在监听了这个事件。

如果使用generator，可以模块1先初始化部分，此时交出控制权，让模块2进行初始化，然后再完成模块1的初始化，就可以不用事件来处理了。

#### 应用场景
#####异步操作的同步化表达
把异步操作写在yield语句里面，在调用next的时候再向后执行，等于就是异步操作的回调可以用同步的方式写出来。

```javascript
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
 hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next()
// 卸载UI
loader.next()
```

Ajax的异步操作同步化表达,和上面的一样，才callback里面调用next，于是generator函数就可以同步化来写了：

```javascript
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}
function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}
var it = main();
it.next();
```

这里还有个逐行读取文本的例子：

```javascript
function* numbers() {
  let file = new FileReader("numbers.txt");
  try {
    while(!file.eof) {
      yield parseInt(file.readLine(), 10);
    }
  } finally {
    file.close();
  }
}
```

tudo:上面为什么要这么写?

todo:还有两个应用....

tudo:yield语句用作函数参数或赋值表达式的右边，可以不加括号?
foo(yield 'a', yield 'b'); // OK
let input = yield; // OK

tudo:与Iterator接口的关系

tudo:throw方法

tudo:yield*命令的作用

tudo:构造函数是generator函数

tudo:es7的generator函数推导
