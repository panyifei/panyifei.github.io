---
layout: default
title: {{ site.name }}
---
# history相关
这里介绍的两个API其实挺关键的，因为现在的前端路由的话其实基本都是pushState和replaceState控制的。

**HTML5** history为window添加了**pushState**，**replaceState**这两个方法，还提供了一个事件**popstate**。具体的方法就不讲解了，直接去官网查看吧。[Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

		于是我们可以在页面上ajax获得数据，重绘页面，然后用户在点击倒退键时，还在这个页面上。因为我们在重绘页面的时候，调用一下pushSate为history增加了一条记录。

自己遵循commonjs写了一个小模块，提供了检验和调用的实现，以下是代码的讲解以及提高的思路。

## 检验的接口：
这个H5的API支持情况很好，但是坑还是很多的。从[caniuse](http://caniuse.com/#search=pushstate)上来看，支持程度很好，但是android的几个版本不支持有些尴尬。不过那几个版本非常小众。这里最终的解决是去[Modernizr](https://modernizr.com/)找的检测方法的代码，因为直接属性检测问题比较大，例如android2.3浏览器支持这个pushState的方法，但是并不支持这个方法的行为...这里还用到了zepto

```javascript
var $ = require('zepto');
var historyState = {};
historyState.ifSupport = function(){
    var ua = navigator.userAgent;
    if ((ua.indexOf('Android 2.') !== -1 ||
        (ua.indexOf('Android 4.0') !== -1)) &&
        ua.indexOf('Mobile Safari') !== -1 &&
        ua.indexOf('Chrome') === -1 &&
        ua.indexOf('Windows Phone') === -1) {
      return false;
    }
    return (window.history && 'pushState' in window.history);
}
```

## 新生成页面调用的接口：
实现思路就是将原来的层隐藏，加入一个新层覆盖上去，然后调用window.history.pushState加一条记录，返回的时候将原来的层清理，并将最开始的层显示出来，顺便清理了这个绑定。

```javascript
/**
 * @param   options     {required}  参数对象
        {
            hideDiv     {required}  需要隐藏的部分
            addDiv      {required}  新增的部分
            wrapDiv     {optional}  包裹的元素，若没有，默认为body
            bindFunc    {optional}  对页面新添加的东西绑定类似点击的事件
            state       {optional}  传入的数据
            title       {optional}  目前被忽略
            url         {optional}  url，需求是不变
        }
 */
historyState.newPage = function(options){
    var hideDiv = options.hideDiv;
    var addDiv = options.addDiv;
    var wrapDiv = options.wrapDiv || $('body');
    var bindFunc = options.bindFunc || function(){};
    var state = options.state || {};
    var title = options.title || '';
    var url = options.url || '';
    //隐藏当前页面，并添加进新页面
    hideDiv.hide();
    wrapDiv.append(addDiv);
    //执行一下可能存在的绑定
    bindFunc();
    //如果支持的话就使用新特性，不支持的话，就不处理了
    if(this.ifSupport()){
        var popFunc = function(event) {
            addDiv.remove();
            hideDiv.show();
            //手动清掉了这个方法
          window.removeEventListener("popstate",popFunc);                  
        };
        window.addEventListener("popstate",popFunc);
        window.history.pushState(state,title,url);
    }
};
module.exports = historyState;
```

## 简单的切换调用的借口

```javascript
/**
 * @param   options     {required}  参数对象
        {
            hideDiv     {required}  需要隐藏的部分
            showDiv      {required}  显示的部分
        }
 */
historyState.switchPage = function(options){
    var hideDiv = options.hideDiv;
    var showDiv = options.showDiv;
    var state = options.state || {};
    var title = options.title || '';
    var url = options.url || '';
    //隐藏当前页面，并添加进新页面
    hideDiv.hide();
    showDiv.show();
    //如果支持的话就使用新特性，不支持的话，就不处理了
    if(this.ifSupport()){
        var popFunc = function(event) {
            hideDiv.show();
            showDiv.hide();
            //手动清掉了这个方法
            window.removeEventListener("popstate",popFunc);                  
        };
        window.addEventListener("popstate",popFunc);
        window.history.pushState(state,title,url);
    }  
};
```

## 不足
模块设计有些问题，导致不能嵌套，而且不能点击前进键。

因为点击即调用了popstate的绑定，如果想支持嵌套的话，得将popstate的绑定放到一个init的函数，这个初始化函数只调用一次就好。

然后再通过改变url的参数来确定到了那个页面就可以支持前进了。

这里给出思路，就不手动实现了。

## 后言
这个模块毕竟有兼容性问题，最后使用了hashchange来实现了，参见[hashchange事件](https://github.com/panyifei/learning/blob/master/HTML5/hashchange事件.md)。
