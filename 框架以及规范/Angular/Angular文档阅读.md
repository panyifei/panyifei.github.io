---
layout: default
title: {{ site.name }}
---
# Angular文档阅读
## 简介
HTML非常适合申明静态文档，但是当想要在WEB app里面声明动态view的时候效果就不好了。Angularjs允许你扩展HTML的语法。效果时更具有可读性，表现力并且很容易开发。

很多其他库都是通过抽象HTML,CSS,JS。但是HTML其实就是为了静态页面的。

Angular可扩展性很好，每个功能都可以修改。

## 添加控制
### 数据绑定
数据绑定是当model改变的时候自动更新view，就像view改变的时候model自动更新一样，他消除了你需要去关心的DOM操作。

### Controller
控制器是DOM元素背后的行为。Angular让你在一个干净的可读形式表达行为，在没有通常的更新DOM的情况下，注册回调已经监听model的改变。

### 朴素的javascript
不像其他的model去继承私有类型来包装你的model，angular的model是非常简单的js对象，这让你很容易去测试，维护，重用和再次免费样板。

## 后端连接
### 深层连接
看不懂？？

### 表单校验
客户端的表单校验是个很重要的用户体验的地方。Angular让你申明form的验证规则而不需要你写代码。

### 与服务器交流
Angular在ajax之上提供了内置的服务，Promise进一步简化了代码处理异步的返回。

## 创建组件
### directives
directives是一个独立的功能强大的特性。Directives让你发明新的HTML语法，特定于你的程序。

### 重用的组件
我们使用Directives来创建可重用的组件。一个组件允许你隐藏复杂的DOM结构，css和行为。这让你分开的专注于应用是干嘛的或者应用看起来是什么样的。

### 本地化
严肃的应用很关键的地方就在于本地化，Angular的语言环境意识到过滤器和阻止directives让你构建能够在所有地区的可用的block。

## Tutorial
### Bootstrapping
ng-app代表着一个Angular的directive叫做ngApp，这个directive是用来标记HTML元素的，angular会识别他作为app的根元素。这让app的开发者自由来控制是整个html还是仅仅只有一部分来当做Angular的app。

其实就是通过这个ng-app来生成整个的model。

### Static Template
就是简单的静态模板

### Angular Templates
这里就是让页面动态，在Angular中，view是model通过HTML模板的投影。意味着，只要model发生改变，Angular刷新相应的绑定，从而更新view。

这里的例子就是使用ngRepeat来取代了硬编码的list。

    ng-repeat是一个Angular的重复的directive。
