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

还有个ng-controller把PhoneListController绑在了body上面。

    ng-controller管理了整个绑定的元素，以及子元素，会有一个自己的model。

#### scope
每个scope都是一层层从上层继承的，每个directive都有自己的一个scope。scope像是胶水一样将template和model和view连接在一起。

### Components
上一章中见到了template和controller如何结合在一起，将静态的html变成动态的view。这是一般的单页应用中常见的情况，客户端接管了页面的渲染，以及根据用户的输入来展示新的内容。

视图作为蓝图告诉我们的数据应该被如何组织以及展示给用户，controller提供了上下文来评估绑定并且对我们的视图应用行为逻辑。

这里还有一些事情可以做的更好：

 - 当我们在我们的应用中想要重用某个相同的方法？我们可能需要将整个模板包括controller都复制一遍，这个很容易引发错误并且伤害到可维护性。
 - 那个连接我们的控制器和模板的scope，与页面的其他部分并不是孤立的，这意味着一个随机的，页面上其他地方的改动，都可能导致错误。

#### 重用的组件
因为模板和控制器的组合是一个常见和共同出现的模式，angular提供了一个简单的并且简明的方法来把他么捆绑成一个可重用的和独立的实体，称之为components。Angular会创建一个相对独立的scope，这意味着没有原型的继承，我们的组件就不会影响到页面的其他内容。这里并没有深入。

组件的声明就是.component()，然后使用的时候就是直接类似于`<greet-user></greet-user>`

这里的template是以$ctrl来访问的，好处是避免了直接的对scope的访问，并且在controller中我们可以直接用this来访问。

注意component的组件的scope是不从页面顶端的scope继承的。

### Directory and File Organization
就是说不在把所有的代码都写在一个文件里面。将每一个功能放在一个文件中。

然后文件夹也根据组件来定义文件夹。

模板也可以提出来放在一个新的文件中。

### Filtering Repeaters
这里的例子加了一个input。通过ngModel这个directive，可以在用户输入结果的同时，就能看到影响。

 - 数据绑定：这是angular的一个核心功能，当页面加载的时候，angular把input的值绑定到model上，然后保持两个同步。当数据模型的变化导致中继器的输入改变了，然后中继器就会根据模型的当前状态来更新DOM。

### Two-way Data Binding
双向绑定的关键其实就在于做了从View向model层的转变。

###  XHR & Dependency Injection
就是angular集成了很多内置的service，比如$http来让你发送请求。那些$$开头的变量意味着是私人的，不应该访问或者修改的。当然我们想要使用他们必须得手动注明引入。

### Templating Links & Images
