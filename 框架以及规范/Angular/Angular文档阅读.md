---
layout: default
title: {{ site.name }}
---
# Angular教程阅读
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
### Routing & Multiple Views
当页面变得复杂的时候，我们开始把index.html变成一个layout，然后把其他的内容展示根据现在的route来加载对应的template。

angular提供了$routeProvider来提供路径功能，用这个我们可以把URL，控制器，模板联合在一起。并且我们可以利用浏览器的历史和书签。

#### A Note about DI, Injector and Providers
DI(依赖注入)是Angular的一个核心，认识他还是蛮重要的。

当应用程序开始的时候，Angular创建了一个你的应用将会使用到的所有的service的注入器。注射器本来不知道你的$http和$route到底做什么。

注射器只按照下面的步骤进行：

 - 加载你在程序中定义的模块定义
 - 注册模块定义中的provider
 - 当被要求的时候，实例化服务以及依赖关系，作为可注射参数函数

这里的template使用的是ng-view这个directive，我们就可以在config里面对使用的模板进行配置。

### More Templating
### Custom Filters
用户可以自己定义filter

### Event Handlers
就是通过ng-click来绑定点击事件

### REST and Custom Services
### Animations
这里就是教我们如何使用动画

## Developer Guide
核心思想是模板，将渲染的过程从后端放到了前端，这样子对于动态页面的更新更加有效。还有一些应用架构，比如scope来将model导出到view，依赖注入等等，还有其他的一些功能。

### Introduction
angular是一个动态web应用程序的结构性框架。他让我们使用html作为模板并且扩展HTML的语法。angular的数据绑定和依赖注入让我们少写了一些可能需要去写的代码。这一切发生在浏览器中，于是可以与任何服务器技术合作。

Angular通过告诉浏览器新的语法我们称之为directive。

Angular是一个完整的客户端解决方案，他处理了你所有的创建，阅读，更新，删除操作，包括复用，依赖注入，数据绑定，模板，表单验证。

Angular通过提供更高程度的抽象来简化应用的开发过程。就像任何的抽象一样，他的灵活是有代价的。换句话说，不是所有的应用都是适合Angualr的。

游戏和GUI编辑器这种密集的DOM操作性的例子就不太适合angular，可能更低级别的抽象比如jQuary更适合些。

#### The Zen of Angular
Angular的构建的意思是申明式的比命令式的更适合UI和布线软件组件。

Angular帮你解脱了以下的痛苦：

 - 注册回调：注册回调让你的代码显得很杂糅，删除那些通常的样板代码比如回调的注册能够大量的减少代码量并且能够更直观的看清楚你的程序在干吗。
 - 操纵DOM编程：操纵DOM是ajax引用的基础，但是它很繁琐并且容易出错。通过申明式的描述你的UI如何变化，你可以解脱于低级的DOM操作。使用angular基本避免了你去操作DOM，当然如果你想的话你也可以。
 - 数据与UI之间的变化：CRUD操作占了大多数的应用程序，整个表单验证，然后返回一个内部的模型，这整个过程有大量的样板代码，angular消除了这其中的样板代码。
 - 写大量的初始化代码：通常你可能需要写大量的代码来得到一个“Hello world”，angular的guide帮你写了整个第一次初始化的过程。

### External Resources
### Conceptual Overview
用一个简单的例子来介绍Angular的所有重要部分。

建议唯一一个该去访问DOM的地方就是自定义的directive。

### Data Binding
Angular中的数据绑定是保持数据在model和view之间自动同步。Angular的实现数据绑定的方式允许你把model当做是你应用的单一可信来源。View在任何时候都是model的一个投影。当model改变的时候，view反应了这个变化，反之亦然。

传统的模板系统就是在某个时刻merge model以及模板。需要去写代码来将两者同步。

Angular模板中的数据绑定则是初始从template编译成view。然后任何view的变化都会立刻在model中反映出来，model中的变化也会立刻反映到view中。可以把视图当做是瞬间的投影。

### Controllers
在angular中，controller被定义为一个js的构造函数，用来增强Angular scope。

当一个controller通过ng-directive被链接到DOM时，angular将会实例化一个控制器对象。

使用controller来初始化scope对象的初始状态。来给scope对象添加行为。

controller里面的scope是一层层继承的。

### Services
Angular services是使用依赖注入的可替换的对象，我们可以使用services来组织并且跨应用程序共享代码。

 - angular只会在应用组件依赖的时候才会去吃实话一个service。
 - 単例：每个组件依赖的service都会得到服务工厂产生的单一实例。

angular提供了好几个service，比如$http。我们是可以自己去定义服务的。

service都是注册在模块上的，service也是可以拥有依赖的。也可以通过模块的config方法中的$provide来注册服务。

### Scopes
Scope是一个对象，指向应用程序的model，他是表达式的执行上下文，作用域可以查看表达式以及传播事件。

#### scope特点
 - scope提供了API($watch)来观察model的变化
 - scope提供了$apply来传递model的变化。
 - 他的可以嵌套或者限制属性。child scope是可以继承parent scope的，但是隔离scope就不会。
 - scope提供了表达式的求的值来作为内容。

#### scope作为数据模型
scope是控制器和view之间的绑定

### Dependency Injection
依赖注入是一个设计模式，他处理组件如何管理他们的依赖。angular的注入子系统负责创建组件，解决他们的依赖，将他们需要的其他组件提供给他们。

#### 使用动态注入
在Angular中DI无处不在，你可以在你定义组件或者为一个模块提供run和config方法的时候使用它。

 - 那些被注入的工厂方法或者构造函数声明的组件例如服务，指令，筛选器和动画。这些组件可以被服务和value组件作为依赖注入。
 - 通过构造函数定义的控制器，他们可以被任意的服务和value组件注入，

#### 为什么要动态注入







### Directives
高层次来说，Directives是DOM元素上的标记，比如属性名，元素名，comment或者css的class。他会告诉angular的HTML编译器($compile)来对DOM元素添加一段特殊的行为。甚至转变DOM以及他的children。

Angular附带了一组内部指令，比如ngBind，ngModel，ngClass。与你创建控制器和服务很像，你可以创建你自己的指令。

编译其实就是给html添加指令来让HTML变得互动，使用编译这个词的原因是因为递归添加指令的过程很像是编译代码语言。
