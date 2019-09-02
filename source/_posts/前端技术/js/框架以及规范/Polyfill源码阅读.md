---
layout: default
title: Polyfill源码阅读
---

在勐喆的推荐下，开始看一些比较浅层次的源码，来加深对于规范的理解。看[polyfill](https://github.com/inexorabletash/polyfill)顺便可以看一下 js 的兼容，还可以了解一些不常用的 API

## CSSOM

### getBoundingClientRect 这个方法在 ie8 下的修正

```javascript
if ("TextRectangle" in this && !("width" in TextRectangle.prototype)) {
  Object.defineProperties(TextRectangle.prototype, {
    width: {
      get: function() {
        return this.right - this.left;
      }
    },
    height: {
      get: function() {
        return this.bottom - this.top;
      }
    }
  });
}
```

getBoundingClientRect 这个方法得到这个元素的 size 并且相对于视图的定位,返回的几个值都是`只读`的

这里对 getBoundingClientRect 方法在 ie8 下面没有 width 和 height 进行了休整。就是对 ie8 window 下的 TextRectangle 进行了 defineProperties。将 width 和 height 进行了定义（这里的定义之所以使用 defineProperties 是因为这里定义了访问器属性，这个属性不能直接定义）。注意在新的浏览器里面，TextRectangle 已经改名了。

注意这里使用的 defineProperties 在 ie 8 以下并不支持，所以这个 polyfill 已经对这个方法进行了修整。就是循环调用了 ie8 支持的 defineProperty 而已，至于 ie7 以下不支持的 defineProperty，会在下面进行分析。

```javascript
Object.prototype.hasOwnProperty.call(properties, name);
```

这里通过 hasOwnProperty 这个判断来只遍历 properties 里面的属性，而不是原型对象上的属性；使用 call 来调用是为了防止对象上自己申明了这个方法，这样子可以使用原型上的。

```javascript
var s = {};
s === Object(s); //true
```

这里通过 Object 方法来判断传入的是不是一个 object~这个写法有点意思。

## Dom

### querySelectorAll

```javascript
document.querySelectorAll = function(selectors) {
  var style = document.createElement("style"),
    elements = [],
    element;
  document.documentElement.firstChild.appendChild(style);
  document._qsa = [];
  style.styleSheet.cssText = selectors + "{x-qsa:expression(document._qsa && document._qsa.push(this))}";
  window.scrollBy(0, 0);
  style.parentNode.removeChild(style);
  while (document._qsa.length) {
    element = document._qsa.shift();
    element.style.removeAttribute("x-qsa");
    elements.push(element);
  }
  document._qsa = null;
  return elements;
};
```

看的好开心，感觉实现很有意思，通过支持率较好的 css 选择器来做这件事情

就是新建一个 style 的元素，并且使用传入的字段作为选择器，然后自定义了一个 x-qsa 的属性。使用到了 expression 这个东西来调用 js，就是应用到的元素自身推入一个准备好的数组中。

然后遍历数组，得到最后的结果了，大赞！！

写法虽然不错，但是 css 的 expression ie8 以后不再支持了，比较尴尬，但是用这个来兼容 ie7 及以下还是很有意思的。

### querySelector

就是调用 querySelectorAll，然后返回第一个值就行了

### getElementsByClassName

类似的，调用上面的 querySelectorAll，只要在前面替换个.就行了

### Node 类型

因为 ie 没有公布它的 Node Type。所以这里添加了 Node.ELEMENT_NODE 这些。

### DOMException

与上面类似的，定义了 DOMException 的一些种类

### Event

重写了 ie8 以下的一些事件处理，包括通过 attachevent 来模拟 addEventListener，通过 detachEvent 来模拟 removeEventListener，这些 ie9 才支持

```javascript
[Window, HTMLDocument, Element].forEach(function(o) {
  o.prototype.addEventListener = addEventListener;
  o.prototype.removeEventListener = removeEventListener;
});
```

重写了这几个方法之后对 window 和 element 应用。

### DOMTokenList

这个东西就是一个接口，一个格式，元素的 classList，rellist 就是遵从的这个规范，就是以空格分开的一些字符串而已。这里就是为 IE9 以下重写了这个东西，提供了一个构造函数，并且使用 defineProperty 来提供那些 toggle，add 等等的方法。

## es5

### getPrototypeOf

这个方法 IE8 以下不支持。

实现就是在判断了`obj !== Object(obj)`也就是返回 `obj.__proto__ || obj.constructor.prototype || Object.prototype`,**proto**这个属性是一些浏览器自己的实现(google,safari,ff)的，不推荐使用。

注意这个方法在 ES6 下的 shim 比较复杂，因为在 ES6 下，一个字符串会返回`String.prototype`，而 es5 则会报错，不过这个方法支持的很好。参见[ES6 支持](http://www.webbrowsercompatibility.com/es6/desktop/)

### getOwnPropertyNames

IE8 以下不支持。

这个就是返回所有属于他自己的属性，包括可枚举的和不可枚举的。实现就是在 for in 中运行一次 Object.prototype.hasOwnProperty 就可以了，当然这样不可枚举的就不行了。

这个 polyfill 有一些问题，不能 cover 下面的，参见[mdn 文档规范]()

```javascript
var arr = ["a", "b", "c"];
console.log(Object.getOwnPropertyNames(arr).sort()); // logs '0,1,2,length'
```

因为他的写法是通过 for in 循环的，而 length 在 array 中是不可枚举的，作者表示除了原生的 getOwnPropertyNames，其他没法拿到不可枚举的。

### Object.create

```javascript
Object.create = function(prototype, properties) {
  if (typeof prototype !== "object") {
    throw TypeError();
  }
  function Ctor() {}
  Ctor.prototype = prototype;
  var o = new Ctor();
  if (prototype) {
    o.constructor = Ctor;
  }
  if (properties !== undefined) {
    if (properties !== Object(properties)) {
      throw TypeError();
    }
    Object.defineProperties(o, properties);
  }
  return o;
};
```

第一个参数是原型，第二个参数是 property，才开始还以为这里比[mdn 文档网站](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill)上的 polyfill 写的好。因为他敢用 defineProperties，结果后来才发现他也就支持了 get，set 和 value。

mdn 上的直接循环赋值了第二个参数，所以那些 getter，setter，writable，enumerable 属性没法设定了，这里鸡贼的调用了 defineProperties，后面他的实现也只有 getter 和 setter。

这里把 constructor 赋值回去的做法已经被放弃了，浏览器都已经放弃这一步操作了....

### Object.defineProperty

```javascript
(function() {
  if (
    !Object.defineProperty ||
    !(function() {
      try {
        Object.defineProperty({}, "x", {});
        return true;
      } catch (e) {
        return false;
      }
    })()
  ) {
    var orig = Object.defineProperty;
    Object.defineProperty = function(o, prop, desc) {
      // In IE8 try built-in implementation for defining properties on DOM prototypes.
      if (orig) {
        try {
          return orig(o, prop, desc);
        } catch (e) {}
      }
      if (o !== Object(o)) {
        throw TypeError("Object.defineProperty called on non-object");
      }
      if (Object.prototype.__defineGetter__ && "get" in desc) {
        Object.prototype.__defineGetter__.call(o, prop, desc.get);
      }
      if (Object.prototype.__defineSetter__ && "set" in desc) {
        Object.prototype.__defineSetter__.call(o, prop, desc.set);
      }
      if ("value" in desc) {
        o[prop] = desc.value;
      }
      return o;
    };
  }
})();
```

因为 IE8 部分支持了这个方法（只支持 DOM Object），所以这里的检测调用了一次，并用了个`try catch`来返回值。

这里在能够使用 IE8 自带的情况下返回自带的。

然后就是使用了两个已经被废弃的函数。`__defineGetter__`和`__defineSetter__`来操作访问器属性，但是那些 enumerable，writable 就不行了。

### Object.defineProperties

这里就是对传入的 properties 进行 for in，然后用 hasOwnProperty 检测一下。再调用上面的 Object.defineProperty。

### Object.keys

返回的自己的可枚举的属性。

这个就是标准的使用 for in，再使用 hasOwnProperty。

`for in`会返回所有的可枚举的属性，包括原型链上的。

### Function.prototype.bind

```javascript
if (!Function.prototype.bind) {
  Function.prototype.bind = function(o) {
    if (typeof this !== "function") {
      throw TypeError("Bind must be called on a function");
    }
    var slice = [].slice,
      args = slice.call(arguments, 1),
      self = this,
      bound = function() {
        return self.apply(this instanceof nop ? this : o, args.concat(slice.call(arguments)));
      };

    function nop() {}
    if (self.prototype) {
      // native functions don't have a prototype
      nop.prototype = self.prototype;
    }
    nop.prototype = self.prototype;
    bound.prototype = new nop();
    return bound;
  };
}
```

bind 方法 IE9 之后才加入的，也就是说一般情况下都不能用咯

这个方法直接抄的 mozilla 官网的，不过写的相当帅气，把一些边界情况考虑的相当完美了。

这里的三目运算符本来百思不得其解的，最后参考了[stackoverflow](http://stackoverflow.com/questions/5774070/mozillas-bind-function-question/5774147#5774147)

- 判断 typeof 是因为一般情况下只有 function 可以执行这个，但是有人强行改变类型调用的话，这里就能阻止住。
- 判断 self.prototype，是因为原生的一些 function 是没有 prototype 的，这个很有意思!!!
- 这里之所以用 concat 是因为 bind 返回的还是一个函数，需要支持他调用时的参数

至于这里为什么要绕一个大弯，因为他想要让 bind 方法适用于`new`，想让他作为一个 constructor 来应用，这里参见[stack_overflow](http://stackoverflow.com/questions/5774070/mozillas-bind-function-question/5774147#5774147),才开始百思不得其解，最后发现自己还是太年轻了，这里的写法都还是讲道理的。

### Array.isArray

用来判断是不是 array 的方法

就是通过原生的 Object.prototype.toString.call([]) == '[object Array]'来判断的，其实也可以在判断了 length 是不是数字之后再看下 length 是不是可枚举的，因为原生的 arry 的 length 是不可枚举的。

### Array.prototype.indexOf 和 lastIndexof

ie9 以上才能用

这里拿 this.length 的时候用了 this.length >>> 0,这一句是位操作符，是针对数字的，功能是

- 将所有的非数值转化为 0
- 将数值所有大于等于 0 的数取整数部分

这样做太安全了，到底有没有价值也不知道。

在进行对比之前，还判断了`index in array`

其他的就是很正常的实现，for 循环进行比较，lastIndexOf 类似，只是换成了从后面查找而已

### Array.prototype.every;some;foreach;map;filter;reduce;reduceRight

ie9 以上才能用

正好复习了一下这几个函数的功能，写法没有什么特别之处，就是 for 循环进行 call 的调用

- every 就是对数组的每一项执行传入的函数，如果所有的都返回 true，才返回 true，否则返回 false。
- some 就是数组中只要有一个符合就会返回 true，否则返回 false
- foreach 就是对每一项进行调用
- map 返回了一个新的数组，将数组每个元素执行方法得到的结果组成一个新数组返回回来
- filter 返回一个执行之后为 true 的数组，就是将每一个执行，如果为 true 就添加进结果

### Array.prototype.reduce 和 Array.prototype.reduceRight

函数的功能是从左向右合并通过函数合并，传入的参数除了 callback，还有一个初始项。

两个的写法很正常，就是简单的实现而已。

之所以比较长是因为做的很安全，各种检测，包括传入的是不是函数，调用的是不是 array 等。

### String.prototype.trim

这个比较简单，但是这边使用的是+号挺有意思的

```javascript
String(this).replace(/^\s+|\s+$/g, "");
```

### Date.now 和 Date.prototype.toISOString

Date 的这两个居然还得 IE9

就是 Number(new Date())

而 toISOString 就是返回 ISO 格式的日期，类似于`2011-10-05T14:48:00.000Z`

实现就是 getUTCFullYear 这种都支持的来拼装一下就行了

### 到此 es5 的 polyfill 就看完了

但是没有 JSON 的实现，JSON 对象在 IE7 以下是没有用的，这里作者推荐使用[JSON-js](https://github.com/douglascrockford/JSON-js)。

overline
