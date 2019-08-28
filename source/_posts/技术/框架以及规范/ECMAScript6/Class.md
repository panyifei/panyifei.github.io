---
layout: default
title: Class
---

# Class

## 基础

主要是传统的方法是通过构造函数，定义并生成新的对象。类似于

```javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototyoe.toString = function() {};
var p = new Point(1, 2);
```

ES6 提供了更接近传统语言的写法，引入了 class 的概念，其实就是个语法糖。

```javascript
var methodName = "getArea";
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return "";
  }
  [methodName]() {}
}
```

上面的类里面有一个 constructor 方法，也就是构造方法了。注意定义类的方法的时候，前面不用加上 function 关键字，另外方法之间不需要逗号分隔，加了会报错。

其实完全就可以看成是 prototype 的另一种写法，就是说内部的实现其实还是 prototype 的。

类的内部所有定义的方法都是不可枚举的。

类的属性名居然可以使用表达式得到~~这个挺酷的

类的构造函数不适用 new 是没法调用的，这是他跟普通构造函数的区别。

Class 不存在变量提升。

### 私有方法

其实 ES6 不支持私有方法这种常见的需求，一般使用下划线来模拟私有方法。

或者使用 Sympol 配合表达式的方式来做，这样外部根本不可能获取的到。

## Class 的继承

```javascript
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y);
    this.color = color;
  }
}
```

注意子类必须在 constructor 方法中调用 super 方法，否则创建实例会报错，因为子类没有自己的 this，必须继承父类的 this 对象。

```javascript
class A {}
class B extends A {}
B.__proto__ === A; //true
B.prototype.__proto__ === A.prototype; //true
```

继承其实加了一道继承链，就是加了**proto**对象，表示构造函数的继承，总是指向父类。

ES5 里面没法继承原生构造函数，因为 ES5 是先构建子类的实例对象，再将父类的属性添加到子类上，但是由于父类的内部属性没法获取，导致无法继承原生的构造函数。但是 ES6 可以，因为 ES6 是先生成父类的实例对象 this，然后用子类的构造函数修饰 this，所以父类的所有行为都是可以继承的。继承 object 的时候会有点问题，会忽略参数，小的注意点吧。

## Class 的 generator 方法

某个方法前面如果加上了星号，该方法就是一个 generator 函数。如果对这个实例执行 for of 的话就会自动调用这个遍历器。

## Class 的静态方法

就是在申明方法的时候加上`static`关键字，该方法就不会被实例继承，而是直接通过类来调用。

ES6 只有静态方法，没有静态属性，ES7 倒是有个静态属性方案，就是正常的实例属性就像方法那么写，静态的类属性加上`static`。

## new.target

之前判断构造函数是不是被 new 调用的，只能通过判断 this 是不是 instanceof 这个构造函数，现在可以直接判断 new.target === undefined 来得到结果。注意，子类继承父类的时候，new.target 会返回子类。用这个特性可以构造出不能实例化只能用于继承的类。

## Mixin 模式的实现

有点类似于多重继承，其实就是将多个类的接口混入另一个类。

```javascript
class A extends mix(B, C) {}
```

## 多重继承

ES6 并没有多重继承，只能用 mix 来模拟多重继承，所以不会有菱形问题。并且由于他是原型链式的继承，所以可以嵌套继承~~
