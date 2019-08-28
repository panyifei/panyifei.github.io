---
layout: default
title: 经典js计算题
---

## 经典 js 计算题

这道题摘自[微信的一篇文章](http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=402252398&idx=1&sn=f163fcc3637f57cd53678e7dd3bea19e&scene=23&srcid=0229uS9TwUS3TYlRIguAgT9v#rd)，坑可谓是很多，而且很细节。

```javascript
function Foo() {
  getName = function() {
    alert(1);
  };
  return this;
}
Foo.getName = function() {
  alert(2);
};
Foo.prototype.getName = function() {
  alert(3);
};
var getName = function() {
  alert(4);
};
function getName() {
  alert(5);
}
//写出下面的结果
Foo.getName(); //2
getName(); //4
Foo().getName(); //1
getName(); //1
new Foo.getName(); //2
new Foo().getName(); //3
new new Foo().getName(); //3
```

一个一个地分析：

### Foo.getName()

这个访问的自然是 Foo 函数上的结果，也没有被覆盖过，所以结果是 2.

### getName()

这个结果有点意思，主要是要理解变量提升。

```javascript
var getName = function() {
  alert(4);
};
function getName() {
  alert(5);
}
```

这个的实际执行其实是：

```javascript
var getName;
function getName() {
  alert(5);
}
getName = function() {
  alert(4);
};
```

所以最后的值是 4。

### Foo().getName()

这里调用了 Foo 方法。Foo 方法里面对 getName 进行了赋值，但是因为没有加上 var，所以会向外查找作用域，在全局中找到了 getName，所以进行赋值。(如果没有找到的话，则会在全局中创建这个变量)。然后 return this，其实就是 window。

然后调用 window.getName()，得到的值就是 1 了。

### getName()

经过了上面的分析，现在全局里面的值就是 1 了。

### new Foo.getName()

这里考察了运算符的优先级

通过查询文档可以知道，(.)的优先级高于 new，所以这里实际上是将 Foo.getName 作为了构造函数，所以结果是 2。

### new Foo().getName()

这里的话，带参数列表的 new 与(.)的优先级一样，所以从右向左，先执行构造函数，然后执行方法的查询调用。

这里构造函数的话，注意如果有 return 语句的话，得看 return 的是什么东西，如果不是引用类型，那么与无 return 一样！！但是如果是引用类型，就会被 return 的东西所替代。当然如果 return 的是 this 的话，就没啥关系了。所以会去原型链上找，得到的结果就是 3 了。

### new new Foo().getName()

这个也是个运算符优先级问题，就是 new ((new Foo()).getName)();等于最后就是将那个原型链的方法作为了构造函数调用，得到的结果就是 3 了。
