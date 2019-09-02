---
layout: default
title: React-router
---

## history module

看 React-router 之前先看 history，history 是个让你很容易的管理会话历史的 js 库。它抽象了各种环境的区别，提供了最小的 api 让你管理历史堆栈，导航，确认导航，并在会话中持久化状态。

他提供了 3 种不同的方法来创建 history 对象，取决于你的环境。

- createBrowserHistory 是为了现代的浏览器，能够用 HTML5 history API 的。就是 pushState 和 popState 的。我们通过 pop 和 push 可以控制页面不重新刷新，就作为前端路由了。他们的第一个参数可以传一个对象，然后在 pop 的时候我们就能够拿到一些状态了。
- createMemoryHistory 用作参考实现或者是没有 dom 的环境，例如 react native 或者测试用例的时候。
- createHashHistory 是为了传统的浏览器~

在 createBrowserHistory 和 createMemoryHistory 中，提供了 state 这种东西，因为 HTML5 history API 提供了存储 state 的地方。createHashHistory 并没有这种东西，我们可以控制 hashType。

## react-router module

他用 history 监听地址栏变化的能力来匹配 route 来正确的渲染组件。

browserHistory 需要后端对于任何的 url 都对应到 index.html 上去。

## hashHistory 的\_k 参数

我们正常使用 push 和 replace 的时候，可以存个 state。

但是 hash history 来转换的时候就是简单的 window.location.hash = newHash，没地方存 state，然后为了都能够使用 location.state，加了个独一无二的 key，然后把 state 存在了 session storage 中。然后回退的时候可以恢复 location.state。

## 小吐槽

react-router 每次触发到一个新路由，之前渲染的组件都会被卸载，也就是都走了 ummount 事件。为什么它不提供给我们选择的机会，让我们自己控制到底是卸载还是隐藏呢，如果只是隐藏的话，我们在回退历史的时候可以做到更好的页面的恢复，而且少了渲染加载的过程。这个问题在它的 issue 里面一直有人提，不过作者觉得这不是 react-router 关注的东西，这是在 router 之上更通用的概念，觉得应该作为一个外部的库来实现这个功能。不过我觉得 react-router 来做更优雅一些
