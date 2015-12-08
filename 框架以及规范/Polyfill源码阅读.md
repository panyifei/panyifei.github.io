# Polyfill源码阅读
在勐喆的推荐下，开始看一些比较浅层次的源码，来加深对于规范的理解。看[polyfill](https://github.com/inexorabletash/polyfill)顺便可以看一下js的兼容，还可以了解一些不常用的API

## CSSom
### getBoundingClientRect这个方法在ie8下的修正
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

这里通过hasOwnProperty这个判断来只遍历properties里面的属性，而不是原型对象上的属性；使用call来调用是为了防止对象上自己申明了这个方法，这样子可以使用原型上的。

```javascript
var s = {};
s === Object({}) //true
```

这里通过Object方法来判断传入的是不是一个object~这个写法有点意思。

## Dom
### querySelectorAll
```javascript
document.querySelectorAll = function(selectors) {
      var style = document.createElement('style'), elements = [], element;
      document.documentElement.firstChild.appendChild(style);
      document._qsa = [];
      style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
      window.scrollBy(0, 0);
      style.parentNode.removeChild(style);
      while (document._qsa.length) {
        element = document._qsa.shift();
        element.style.removeAttribute('x-qsa');
        elements.push(element);
      }
      document._qsa = null;
      return elements;
    };
```

看的好开心，感觉实现很有意思，通过支持率较好的css选择器来做这件事情

就是新建一个style的元素，并且使用传入的字段作为选择器，然后自定义了一个x-qsa的属性。使用到了expression这个东西来调用js，就是应用到的元素自身推入一个准备好的数组中。

然后遍历数组，得到最后的结果了，大赞！！

写法虽然不错，但是css的expression ie8以后不再支持了，比较尴尬，但是用这个来兼容ie7及以下还是很有意思的。

### querySelector
就是调用querySelectorAll，然后返回第一个值就行了

### getElementsByClassName
类似的，调用上面的querySelectorAll，只要在前面替换个.就行了

### Node 类型
因为ie没有公布它的Node Type。所以这里添加了Node.ELEMENT_NODE这些。

### DOMException
与上面类似的，定义了DOMException的一些种类

### Event
重写了ie8以下的一些事件处理，包括通过attachevent来模拟addEventListener，通过detachEvent来模拟removeEventListener，这些ie9才支持

```javascript
[Window, HTMLDocument, Element].forEach(function(o) {
      o.prototype.addEventListener = addEventListener;
      o.prototype.removeEventListener = removeEventListener;
    });
```

重写了这几个方法之后对window和element应用。

### DOMTokenList
这个东西就是一个接口，一个格式，元素的classList，rellist就是遵从的这个规范，就是以空格分开的一些字符串而已。这里就是为IE9以下重写了这个东西，提供了一个构造函数，并且使用defineProperty来提供那些toggle，add等等的方法。

## es5
### getPrototypeOf
这个方法IE8以下不支持。

实现就是在判断了`obj !== Object(obj)`也就是返回 `obj.__proto__  || obj.constructor.prototype || Object.prototype`,__proto__这个属性是一些浏览器自己的实现(google,safari,ff)的，不推荐使用。

注意这个方法在ES6下的shim比较复杂，因为在ES6下，一个字符串会返回`String.prototype`，而es5则会报错，不过这个方法支持的很好。参见[ES6支持](http://www.webbrowsercompatibility.com/es6/desktop/)

### getOwnPropertyNames
这个就是返回所有属于他自己的属性，实现就是在for in中运行一次Object.prototype.hasOwnProperty就可以了。
这个polyfill有bug，不能cover下面的，参见[文档规范]()

```javascript
var arr = ['a', 'b', 'c'];
console.log(Object.getOwnPropertyNames(arr).sort()); // logs '0,1,2,length'
```

因为他的写法是通过for in循环的，而length在array中是不可枚举的，已经提交了issue给作者。










