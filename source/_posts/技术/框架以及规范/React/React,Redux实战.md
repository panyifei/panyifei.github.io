---
layout: default
title: React,Redux实战
---

### 运行时修改 this.props

无法在运行过程中直接对 this.props 进行修改，我们只能为之写一个 action 来触发，然后重绘。

### 访问 url 里 restful 传入的 id

使用`this.props.routeParams`可以访问。

### 防止 jsx 对 html 结构进行转义

```html
<div dangerouslySetInnerHTML="\{#\{__html:" apiDetail\}#\}></div>
```

### action 的处理过程

action 会触发 reducer，然后通过 reducer 里面对 action.type 的判断来决定页面上 this.props 的值。这里的值可以由全局的 state 和 action 里面的 data 混合着返回。

然后就会触发页面上`componentWillMount`的方法，进而对页面进行重绘。

### render 方法的执行条件

如果我们在父元素里面调用了 render，那么子元素肯定执行 render 的。

如果我们想要阻止子元素的 render，我们可以在子元素里面进行 shouldComponentUpdate 来进行 compare。我们可以使用 shallowCompare 来简单的比较引用是否改变。因为如果我们想要传新对象的话，这个肯定会渲染的。而如果我们还传老的对象，代表我们并没有修改。层次比较多的时候我们可以使用 update 这个 add-on 来执行我们的更新操作。

### react 想根据 props 来设置 state

如果是首次的话，在 constructor 里面就好了。如果是想在更新的时候，因为 componentWillUpdate 里面不能做 setState 的操作，所以只能在 componentWillReceiveProps 里面进行操作
