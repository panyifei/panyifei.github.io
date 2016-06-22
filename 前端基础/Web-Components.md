---
layout: default
title: {{ site.name }}
---
# Web Components
准备在组内分享下Web Components，所以自己先学习一下

大家都是在以插件或者模块的形式分享自己的代码库。

大家使用组件都是剪切js，剪切css，然后再把html贴进来。然后你就会担心引入的这个东西会破坏你的页面。

这种情况下，Web Components就是这种情况下的一个解决方案，通过标准化，非侵入的方式来封装一个组件。这样不会干扰页面上的其他代码。

web component是由4种技术组成的：Template、Custom Element、Shadow DOM、HTML Import四种技术规范。Custom Element和Shadow DOM最重要，Template和HTML Import只起到辅助作用。

## Custom Element
HTML预定义的网页元素很多时候不符合我们的需求，虽然HTML5已经在尽量的语义化了。但是我们还是需要自定义元素。这个其实是Web Component的核心。注意标签名必须有至少一个连字符"-"，为了和内置的HTML元素标签名区分开。

在使用之前，我们要先用registerElement注册一下这个自定义的元素。我们可以注册了之后直接添加到DOM中，就像是

```javascript
var SuperButton = document.registerElement('super-button');
document.body.appendChild(new SuperButton());
```

也可以传入元素的prototype

```javascript
var buttonProto = Object.create(HTMLElement.prototype);
buttonProto.print = function() {
  console.log('Super Button!');
}
var SuperButton = document.registerElement('super-button', {
  prototype: buttonProto
});
var supperButton = document.querySelector('super-button');
supperButton.print();
```

我们还可以用它来继承，或者添加属性和方法，很强大。

然后它还提供了一些很有用的回调函数，通过这些回调函数，我们可以决定什么时候操作DOM之类的。


## Shadow Dom
就是开发者可以使用这个创建完全独立于其他元素的子DOM树。由于这个特性，我们可以封装一个具有独立功能的组件，保证不干扰到其他DOM元素。我们可以设置他的样式，以及js调用。主文档流和基于Shandow Dom创建的独立组件之间互不干扰，所以组件的复用就变的简单可行。主要好处就是封装了内部样式表，隐藏实现细节。

注意Shadow Dom必须依赖于一个现有的元素之下，通过createShadowRoot来创建，然后将其插入该元素。

```javascript
var shadowRoot = element.createShadowRoot();
document.body.appendChild(shadowRoot);
```

## Template
大家肯定都用过，在HTML5标准下，我们甚至不需要JS框架就能使用模板。有一个template元素，但是支持情况特别差就是咧。

我们使用template的话，就是通过querySelector来拿到template，然后对他的content的值进行设置，然后就可以把这个模板加入到DOM中了。这里插入DOM的话，建议使用document.importNode()来复制这个节点，主要是为了模板的复用。这个函数有个二参，是否复制子节点，我们基本上是要显示的标示为true的。（这个方法IE9以上支持）。

## HTML Import
长久以来，网页可以加载外部的样式表，脚本，图片，多媒体但是其实没有什么好的办法来加载其他网页的，iframe和ajax都只能解决部分问题。HTML Import就是为了解决这个问题提出的。

用于将外部的HTML文档加载进当前的文档，我们可以将html，css，js封装在一个文件里。

这里有个貌似大问题，这里必须得同域！！

我们除了使用link标签，还可以使用javascript来调用link元素，完成HTML Import。

在模板中创建HTML代码和子DOM树，我们可以通过不同的物理文件来组织代码，通过link标签来引入这些文件，就像我们在PHP中引入js一样。

## 写第一个web component
我这里直接抄了别人的一个例子，在chrome里面运行是没有什么问题的。但是现在基本上只有chrome和opera才能使用。

当然我们可以引入一些polyfill来办这件事。

这里原生的是从document.currentScript中读取的，使用了polyfill之后就是document._currentScript了，加了个下划线，可用是可用了。

但是太大了，有100KB。

这个网站就是完全用的web component，https://shop.polymer-project.org/list/mens_tshirts

## 好处
标准的非侵入的方式来封装这个组件的好处
### 完全无害
引入第三方插件时，完全不需要担心他对你的网站的其他部分造成影响。哪怕我们申明一些!important的类，一样不会影响到。有示例。

### 通用性
这点其实很关键，我们很多时候基于jquery在开发插件，基于cortex开发插件，基于react来开发插件，脱离了这几个运行环境，我们的组件就失去了价值，但是我们通过web component的规范，就很容易通用。

### 维护和测试
独立性的好处嘛，容易维护和测试

### 更好的语义化
html5其实已经在语义化的路上做的很深入，使用web component可以完全的语义化。

### web components现在这个规范的实现框架也已经有了三个了
X-Tag, Polymer, Bosonic，skatejs，这四个的写法差别也特别大。

## Polymer
这个好像是最火的一个，这个是Google 2013年I/O大会上提出的一个UI框架，实现了WebComponent标准，保证了各平台的Web Component规范的本地实现使用的效果相同。

框架分为了3层：

 - 基础层：基础构建块，包括DOM Mutation Oberservers和Object.observe()(用于观察DOM元素变更)，指针事件，阴影DOM(封装结构和样式，适合自定义元素)，自定义元素(自定义HTML5的元素，名字必须包含一个破折号，区分标准元素)，HTML导入(可能包含了html，css和JS)，模型驱动的视图(MDV)(数据直接帮到HTML上)，Web动画(一套统一的Web动画API)，目前31KB。
 - 核心层：实现基础层的辅助器
 - 元素层：核心层之上的UI组件或非UI组件

Polymer使用了HTML imports来进行依赖管理，确保自定义元素及其所有的依赖项都在使用之前被加载进来。

### VM特性
他也支持数据的双向绑定了。

```javascript
<polymer-element name="name-tag">
  <template>
    这是一个 <b>{{owner}}</b> 的 name-tag element。
  </template>
  <script>
    Polymer('name-tag', {
      // initialize the element's model
      ready: function() {
        this.owner = 'Rafael';
      }
    });
  </script>
</polymer-element>
```

这里的name-tag就像是angular的controller。我们手动改值document.querySelector('name-tag').owner = 'shabi';页面上看到的结果也会被改变。

### 思考
react的组件生态思想和webcomponent很类似，但是他做了更多的事情，除了web Component，react想做的是platform component。

angular2.0已明确提出将支持Node绑定、模板集成。也开始支持web component规范，代表这个规范在将来肯定是会变成趋势的。

参考：

http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-201/#toc-style-scoped
