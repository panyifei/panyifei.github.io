---
layout: default
title: Angular教程阅读
---

# Angular 教程阅读

## 简介

HTML 非常适合申明静态文档，但是当想要在 WEB app 里面声明动态 view 的时候效果就不好了。Angularjs 允许你扩展 HTML 的语法。效果时更具有可读性，表现力并且很容易开发。

很多其他库都是通过抽象 HTML,CSS,JS。但是 HTML 其实就是为了静态页面的。

Angular 可扩展性很好，每个功能都可以修改。

## 添加控制

### 数据绑定

数据绑定是当 model 改变的时候自动更新 view，就像 view 改变的时候 model 自动更新一样，他消除了你需要去关心的 DOM 操作。

### Controller

控制器是 DOM 元素背后的行为。Angular 让你在一个干净的可读形式表达行为，在没有通常的更新 DOM 的情况下，注册回调已经监听 model 的改变。

### 朴素的 javascript

不像其他的 model 去继承私有类型来包装你的 model，angular 的 model 是非常简单的 js 对象，这让你很容易去测试，维护，重用和再次免费样板。

## 后端连接

### 深层连接

看不懂？？

### 表单校验

客户端的表单校验是个很重要的用户体验的地方。Angular 让你申明 form 的验证规则而不需要你写代码。

### 与服务器交流

Angular 在 ajax 之上提供了内置的服务，Promise 进一步简化了代码处理异步的返回。

## 创建组件

### directives

directives 是一个独立的功能强大的特性。Directives 让你发明新的 HTML 语法，特定于你的程序。

### 重用的组件

我们使用 Directives 来创建可重用的组件。一个组件允许你隐藏复杂的 DOM 结构，css 和行为。这让你分开的专注于应用是干嘛的或者应用看起来是什么样的。

### 本地化

严肃的应用很关键的地方就在于本地化，Angular 的语言环境意识到过滤器和阻止 directives 让你构建能够在所有地区的可用的 block。

## Tutorial

### Bootstrapping

ng-app 代表着一个 Angular 的 directive 叫做 ngApp，这个 directive 是用来标记 HTML 元素的，angular 会识别他作为 app 的根元素。这让 app 的开发者自由来控制是整个 html 还是仅仅只有一部分来当做 Angular 的 app。

其实就是通过这个 ng-app 来生成整个的 model。

### Static Template

就是简单的静态模板

### Angular Templates

这里就是让页面动态，在 Angular 中，view 是 model 通过 HTML 模板的投影。意味着，只要 model 发生改变，Angular 刷新相应的绑定，从而更新 view。

这里的例子就是使用 ngRepeat 来取代了硬编码的 list。

    ng-repeat是一个Angular的重复的directive。

还有个 ng-controller 把 PhoneListController 绑在了 body 上面。

    ng-controller管理了整个绑定的元素，以及子元素，会有一个自己的model。

#### scope

每个 scope 都是一层层从上层继承的，每个 directive 都有自己的一个 scope。scope 像是胶水一样将 template 和 model 和 view 连接在一起。

### Components

上一章中见到了 template 和 controller 如何结合在一起，将静态的 html 变成动态的 view。这是一般的单页应用中常见的情况，客户端接管了页面的渲染，以及根据用户的输入来展示新的内容。

视图作为蓝图告诉我们的数据应该被如何组织以及展示给用户，controller 提供了上下文来评估绑定并且对我们的视图应用行为逻辑。

这里还有一些事情可以做的更好：

- 当我们在我们的应用中想要重用某个相同的方法？我们可能需要将整个模板包括 controller 都复制一遍，这个很容易引发错误并且伤害到可维护性。
- 那个连接我们的控制器和模板的 scope，与页面的其他部分并不是孤立的，这意味着一个随机的，页面上其他地方的改动，都可能导致错误。

#### 重用的组件

因为模板和控制器的组合是一个常见和共同出现的模式，angular 提供了一个简单的并且简明的方法来把他么捆绑成一个可重用的和独立的实体，称之为 components。Angular 会创建一个相对独立的 scope，这意味着没有原型的继承，我们的组件就不会影响到页面的其他内容。这里并没有深入。

组件的声明就是.component()，然后使用的时候就是直接类似于`<greet-user></greet-user>`

这里的 template 是以\$ctrl 来访问的，好处是避免了直接的对 scope 的访问，并且在 controller 中我们可以直接用 this 来访问。

注意 component 的组件的 scope 是不从页面顶端的 scope 继承的。

### Directory and File Organization

就是说不在把所有的代码都写在一个文件里面。将每一个功能放在一个文件中。

然后文件夹也根据组件来定义文件夹。

模板也可以提出来放在一个新的文件中。

### Filtering Repeaters

这里的例子加了一个 input。通过 ngModel 这个 directive，可以在用户输入结果的同时，就能看到影响。

- 数据绑定：这是 angular 的一个核心功能，当页面加载的时候，angular 把 input 的值绑定到 model 上，然后保持两个同步。当数据模型的变化导致中继器的输入改变了，然后中继器就会根据模型的当前状态来更新 DOM。

### Two-way Data Binding

双向绑定的关键其实就在于做了从 View 向 model 层的转变。

### XHR & Dependency Injection

就是 angular 集成了很多内置的 service，比如$http来让你发送请求。那些$\$开头的变量意味着是私人的，不应该访问或者修改的。当然我们想要使用他们必须得手动注明引入。

### Templating Links & Images

### Routing & Multiple Views

当页面变得复杂的时候，我们开始把 index.html 变成一个 layout，然后把其他的内容展示根据现在的 route 来加载对应的 template。

angular 提供了\$routeProvider 来提供路径功能，用这个我们可以把 URL，控制器，模板联合在一起。并且我们可以利用浏览器的历史和书签。

#### A Note about DI, Injector and Providers

DI(依赖注入)是 Angular 的一个核心，认识他还是蛮重要的。

当应用程序开始的时候，Angular 创建了一个你的应用将会使用到的所有的 service 的注入器。注射器本来不知道你的$http和$route 到底做什么。

注射器只按照下面的步骤进行：

- 加载你在程序中定义的模块定义
- 注册模块定义中的 provider
- 当被要求的时候，实例化服务以及依赖关系，作为可注射参数函数

这里的 template 使用的是 ng-view 这个 directive，我们就可以在 config 里面对使用的模板进行配置。

### More Templating

### Custom Filters

用户可以自己定义 filter

### Event Handlers

就是通过 ng-click 来绑定点击事件

### REST and Custom Services

### Animations

这里就是教我们如何使用动画

## Developer Guide

核心思想是模板，将渲染的过程从后端放到了前端，这样子对于动态页面的更新更加有效。还有一些应用架构，比如 scope 来将 model 导出到 view，依赖注入等等，还有其他的一些功能。

### Introduction

angular 是一个动态 web 应用程序的结构性框架。他让我们使用 html 作为模板并且扩展 HTML 的语法。angular 的数据绑定和依赖注入让我们少写了一些可能需要去写的代码。这一切发生在浏览器中，于是可以与任何服务器技术合作。

Angular 通过告诉浏览器新的语法我们称之为 directive。

Angular 是一个完整的客户端解决方案，他处理了你所有的创建，阅读，更新，删除操作，包括复用，依赖注入，数据绑定，模板，表单验证。

Angular 通过提供更高程度的抽象来简化应用的开发过程。就像任何的抽象一样，他的灵活是有代价的。换句话说，不是所有的应用都是适合 Angualr 的。

游戏和 GUI 编辑器这种密集的 DOM 操作性的例子就不太适合 angular，可能更低级别的抽象比如 jQuary 更适合些。

#### The Zen of Angular

Angular 的构建的意思是申明式的比命令式的更适合 UI 和布线软件组件。

Angular 帮你解脱了以下的痛苦：

- 注册回调：注册回调让你的代码显得很杂糅，删除那些通常的样板代码比如回调的注册能够大量的减少代码量并且能够更直观的看清楚你的程序在干吗。
- 操纵 DOM 编程：操纵 DOM 是 ajax 引用的基础，但是它很繁琐并且容易出错。通过申明式的描述你的 UI 如何变化，你可以解脱于低级的 DOM 操作。使用 angular 基本避免了你去操作 DOM，当然如果你想的话你也可以。
- 数据与 UI 之间的变化：CRUD 操作占了大多数的应用程序，整个表单验证，然后返回一个内部的模型，这整个过程有大量的样板代码，angular 消除了这其中的样板代码。
- 写大量的初始化代码：通常你可能需要写大量的代码来得到一个“Hello world”，angular 的 guide 帮你写了整个第一次初始化的过程。

### External Resources

### Conceptual Overview

用一个简单的例子来介绍 Angular 的所有重要部分。

建议唯一一个该去访问 DOM 的地方就是自定义的 directive。

### Data Binding

Angular 中的数据绑定是保持数据在 model 和 view 之间自动同步。Angular 的实现数据绑定的方式允许你把 model 当做是你应用的单一可信来源。View 在任何时候都是 model 的一个投影。当 model 改变的时候，view 反应了这个变化，反之亦然。

传统的模板系统就是在某个时刻 merge model 以及模板。需要去写代码来将两者同步。

Angular 模板中的数据绑定则是初始从 template 编译成 view。然后任何 view 的变化都会立刻在 model 中反映出来，model 中的变化也会立刻反映到 view 中。可以把视图当做是瞬间的投影。

### Controllers

在 angular 中，controller 被定义为一个 js 的构造函数，用来增强 Angular scope。

当一个 controller 通过 ng-directive 被链接到 DOM 时，angular 将会实例化一个控制器对象。

使用 controller 来初始化 scope 对象的初始状态。来给 scope 对象添加行为。

controller 里面的 scope 是一层层继承的。

### Services

Angular services 是使用依赖注入的可替换的对象，我们可以使用 services 来组织并且跨应用程序共享代码。

- angular 只会在应用组件依赖的时候才会去吃实话一个 service。
- 単例：每个组件依赖的 service 都会得到服务工厂产生的单一实例。

angular 提供了好几个 service，比如\$http。我们是可以自己去定义服务的。

service 都是注册在模块上的，service 也是可以拥有依赖的。也可以通过模块的 config 方法中的\$provide 来注册服务。

### Scopes

Scope 是一个对象，指向应用程序的 model，他是表达式的执行上下文，作用域可以查看表达式以及传播事件。

#### scope 特点

- scope 提供了 API(\$watch)来观察 model 的变化
- scope 提供了\$apply 来传递 model 的变化。
- 他的可以嵌套或者限制属性。child scope 是可以继承 parent scope 的，但是隔离 scope 就不会。
- scope 提供了表达式的求的值来作为内容。

#### scope 作为数据模型

scope 是控制器和 view 之间的绑定

### Dependency Injection

依赖注入是一个设计模式，他处理组件如何管理他们的依赖。angular 的注入子系统负责创建组件，解决他们的依赖，将他们需要的其他组件提供给他们。

#### 使用动态注入

在 Angular 中 DI 无处不在，你可以在你定义组件或者为一个模块提供 run 和 config 方法的时候使用它。

- 那些被注入的工厂方法或者构造函数声明的组件例如服务，指令，筛选器和动画。这些组件可以被服务和 value 组件作为依赖注入。
- 通过构造函数定义的控制器，他们可以被任意的服务和 value 组件注入，

#### 为什么要动态注入

### Directives

高层次来说，Directives 是 DOM 元素上的标记，比如属性名，元素名，comment 或者 css 的 class。他会告诉 angular 的 HTML 编译器(\$compile)来对 DOM 元素添加一段特殊的行为。甚至转变 DOM 以及他的 children。

Angular 附带了一组内部指令，比如 ngBind，ngModel，ngClass。与你创建控制器和服务很像，你可以创建你自己的指令。

编译其实就是给 html 添加指令来让 HTML 变得互动，使用编译这个词的原因是因为递归添加指令的过程很像是编译代码语言。
