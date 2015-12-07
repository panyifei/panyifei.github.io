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

### 


