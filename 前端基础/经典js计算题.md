## 经典js计算题
这道题摘自[微信的一篇文章](http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=402252398&idx=1&sn=f163fcc3637f57cd53678e7dd3bea19e&scene=23&srcid=0229uS9TwUS3TYlRIguAgT9v#rd)，坑可谓是很多，而且很细节。

```javascript
function Foo() {
    getName = function () { alert (1); };
    return this;
}
Foo.getName = function () { alert (2);};
Foo.prototype.getName = function () { alert (3);};
var getName = function () { alert (4);};
function getName() { alert (5);}
//写出下面的结果
Foo.getName();//2
getName();//4
Foo().getName();//1
getName();//1
new Foo.getName();//2
new Foo().getName();//3
new new Foo().getName();//3
```

一个一个地分析：

### Foo.getName()
这个访问的自然是Foo函数上的结果，也没有被覆盖过，所以结果是2.

### getName()
这个结果有点意思，主要是要理解变量提升。

```javascript
var getName = function () { alert (4);};
function getName() { alert (5);}
```

这个的实际执行其实是：

```javascript
var getName;
function getName(){alert(5);}
getName = function(){alert(4);}
```

所以最后的值是4。

### Foo().getName()
这里调用了Foo方法。Foo方法里面对getName进行了赋值，但是因为没有加上var，所以会向外查找作用域，在全局中找到了getName，所以进行赋值。(如果没有找到的话，则会在全局中创建这个变量)。然后return this，其实就是window。

然后调用window.getName()，得到的值就是1了。

### getName()
经过了上面的分析，现在全局里面的值就是1了。

### new Foo.getName()
这里考察了运算符的优先级

通过查询文档可以知道，(.)的优先级高于new，所以这里实际上是将Foo.getName作为了构造函数，所以结果是2。

### new Foo().getName()
这里的话，带参数列表的new与(.)的优先级一样，所以从右向左，先执行构造函数，然后执行方法的查询调用。

这里构造函数的话，注意如果有return语句的话，得看return的是什么东西，如果不是引用类型，那么与无return一样！！但是如果是引用类型，就会被return的东西所替代。当然如果return的是this的话，就没啥关系了。所以会去原型链上找，得到的结果就是3了。

### new new Foo().getName()
这个也是个运算符优先级问题，就是new ((new Foo()).getName)();等于最后就是将那个原型链的方法作为了构造函数调用，得到的结果就是3了。
