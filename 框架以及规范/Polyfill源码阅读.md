# Polyfill源码阅读
在勐喆的推荐下，开始看一些比较浅层次的源码，来加深对于规范的理解。看[polyfill](https://github.com/inexorabletash/polyfill)顺便可以看一下js的兼容，还可以了解一些不常用的API

## CSSom
```javascript
if ('TextRectangle' in this && !('width' in TextRectangle.prototype)) {
    Object.defineProperties(TextRectangle.prototype, {
      'width': { get: function() { return this.right - this.left; } },
      'height': { get: function() { return this.bottom - this.top; } }
    });
  }
```

getBoundingClientRect这个方法得到这个元素的size并且相对于视图的定位,返回的几个值都是`只读`的

这里对getBoundingClientRect方法在ie8下面没有width和height进行了休整。就是对ie8 window下的TextRectangle进行了defineProperties。将width和height进行了定义（这里的定义之所以使用defineProperties是因为这里定义了访问器属性，这个属性不能直接定义）。注意在新的浏览器里面，TextRectangle已经改名了。

注意这里使用的defineProperties在ie 8以下并不支持，所以这个polyfill已经对这个方法进行了修整。这里只修正了ie8，就是循环调用了ie8支持的defineProperty而已。

```javascript
Object.prototype.hasOwnProperty.call(properties, name)
```

这里通过hasOwnProperty这个判断来只遍历properties里面的，而不是原型对象上的。

```javascript
var s = {};
s === Object({}) //true
```

这里通过Object方法来判断传入的是不是一个object~这个写法有点意思。

