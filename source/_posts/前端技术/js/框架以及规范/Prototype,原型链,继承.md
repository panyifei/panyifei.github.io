---
layout: default
title: Prototype,原型链,继承
---

- function 都是由 prototype 的，指向一个对象，注意全局函数并没有 prototype。
- object 指向原型对像的只有**proto**这个属性(es5 就有一个 getPrototypeOf 来拿到**proto**)，并且并不规范，之后 chrome，ff 等几个实现了，这个东西可以用来向上层遍历。原型对象会有一个 contructor，指向构造函数(所以当我们重写了 prototype 对象的时候，我们得要重写一下 constractor 对象)。
- Object.getPrototypeOf 可以拿来向上查找原型链，但这是 ES6 的特性。
- Object.prototype 的原型是 null，这个本身是个特殊的对象，是个原型对象指向 null 的特殊对象。

```javascript
function A() {}
function B() {}
B.prototype = new A();
var b = new B();
b.__proto__ == A.prototype;
//class等于就是加上了一层__proto__指向继承的class
class A {}
class B extends A {}
B.__proto__ === A; // true
B.prototype.__proto__ === A.prototype; // true
```

## Object.create

这个方法很神奇，与 new Foo()的效果差不多。这里的区别我再去高程看看清楚。

ES6 还提供了 Object.setProtypeOf(Bar.prototype, Foo.prototype);
