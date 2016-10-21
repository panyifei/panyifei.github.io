---
layout: default
title: {{ site.name }}
---
# Prototype,原型链,继承
- function都是由prototype的，指向一个对象，注意全局函数并没有prototype。
- object指向原型对像的只有__proto__这个属性(es5就有一个getPrototypeOf来拿到__proto__)，并且并不规范，之后chrome，ff等几个实现了，这个东西可以用来向上层遍历。原型对象会有一个contructor，指向构造函数(所以当我们重写了prototype对象的时候，我们得要重写一下constractor对象)。
- Object.getPrototypeOf可以拿来向上查找原型链，但这是ES6的特性。
- Object.prototype的原型是null，这个本身是个特殊的对象，是个原型对象指向null的特殊对象。


```javascript
    function A(){
    }
    function B(){
    }
    B.prototype = new A();
    var b = new B();
    b.__proto__ == A.prototype;
    //class等于就是加上了一层__proto__指向继承的class
    class A {
    }
    class B extends A {
    }
    B.__proto__ === A // true
    B.prototype.__proto__ === A.prototype // true
```

## Object.create
这个方法很神奇，与new Foo()的效果差不多。这里的区别我再去高程看看清楚。

ES6还提供了Object.setProtypeOf(Bar.prototype, Foo.prototype);
