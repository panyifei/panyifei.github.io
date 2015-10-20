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





tudo:yield语句用作函数参数或赋值表达式的右边，可以不加括号?
foo(yield 'a', yield 'b'); // OK
let input = yield; // OK
tudo:与Iterator接口的关系
tudo:throw方法




