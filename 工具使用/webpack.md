---
layout: default
title: {{ site.name }}
---
# webpack
虽然webpack已经用了蛮久了，这次系统的看一下他的文档。

 - 插件：它具有丰富的插件接口，可以让外部做一些插件。这让webpack可扩展性。
 - 加载器：通过loader来对文件进行预编译，这就意味着可以对任意的静态资源进行打包。可以很容易的写自己的loader
 - 代码分割：允许将代码库分割成大块，这样就可以减少最初的加载时间
 - 开发工具：支持sourceUrl和sourceMap，他可以监视你的文件，通过一个开发中间件或者开发server来自动重新渲染
 - 表现：webpack使用了异步的IO，并且有多层的缓存等级，让webpack很快并且在增量编译的时候很快
 - 支持：支持AMD和Commonjs，能在分析你的代码的AST的时候表现的很聪明，甚至有一个分析的引擎
 - 优化：做了很多优化来减少打包的最后的大小，通过hash来关心请求被缓存
 - 多种目标：webpack的主要目标是web，也提供了bundle为了webworker和nodejs。
