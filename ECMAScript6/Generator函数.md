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


