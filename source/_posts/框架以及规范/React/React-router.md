---
layout: default
title: \{#\{ site.name \}#\}
---
## React-router
## history module
看React-router之前先看history，history是个让你很容易的管理会话历史的js库。它抽象了各种环境的区别，提供了最小的api让你管理历史堆栈，导航，确认导航，并在会话中持久化状态。

他提供了3种不同的方法来创建history对象，取决于你的环境。

 - createBrowserHistory是为了现代的浏览器，能够用HTML5 history API的。就是pushState和popState的。我们通过pop和push可以控制页面不重新刷新，就作为前端路由了。他们的第一个参数可以传一个对象，然后在pop的时候我们就能够拿到一些状态了。
 - createMemoryHistory用作参考实现或者是没有dom的环境，例如react native或者测试用例的时候。
 - createHashHistory是为了传统的浏览器~

在createBrowserHistory和createMemoryHistory中，提供了state这种东西，因为HTML5 history API提供了存储state的地方。createHashHistory并没有这种东西，我们可以控制hashType。

## react-router module
他用history监听地址栏变化的能力来匹配route来正确的渲染组件。

browserHistory需要后端对于任何的url都对应到index.html上去。

## hashHistory的_k参数
我们正常使用push和replace的时候，可以存个state。

但是hash history来转换的时候就是简单的window.location.hash = newHash，没地方存state，然后为了都能够使用location.state，加了个独一无二的key，然后把state存在了session storage中。然后回退的时候可以恢复location.state。

## 小吐槽
react-router每次触发到一个新路由，之前渲染的组件都会被卸载，也就是都走了ummount事件。为什么它不提供给我们选择的机会，让我们自己控制到底是卸载还是隐藏呢，如果只是隐藏的话，我们在回退历史的时候可以做到更好的页面的恢复，而且少了渲染加载的过程。这个问题在它的issue里面一直有人提，不过作者觉得这不是react-router关注的东西，这是在router之上更通用的概念，觉得应该作为一个外部的库来实现这个功能。不过我觉得react-router来做更优雅一些
