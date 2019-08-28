---
layout: default
title: webpack深入探索
---

## resolve

只要把 node_modules 路径添加到 resolve 里面的 root 里面，就可以直接 load npm 模块了。

## loader

这个是个流式的操作，可以理解为 pipe，从右向左执行。

## 资源依赖处理

打包的最后是一个匿名自执行函数。感觉主要就是一个**webpack_require**函数，很 easy 嘛。找机会看看代码。

webpack 把资源重新编号，每一个资源都成为一个模块。对应一个 ID。

比如`url?limit=10000&name=img/[hash:8].[name].[ext]`的意思是小于 10KB 的时候会自动转为 base64，可以减少一个 HTTP 请求。如果大于 10KB，就会加上 8 位的 hash，保证即时更新。

## 编译输出

3 个概念：

- 模块：各种资源文件，一切资源都是模块
- entry：一个或者多个资源合并，由 html 通过 script 引入
- chunk：被 entry 引入的额外的代码块，可以包含一个或者多个文件(其实就是 code spliting 的部分嘛)

## webpack 的整体执行过程

- 输入 webpack 之后，会调用 wepack 的 bin 里面的命令，将 shell 脚本以及 config 里面的参数进行合并，然后传到下一个流程的控制对象。
- 开始执行 webpack 最漫长的一步，真正的 webpack 对象刚刚被初始化。
- 实际入口是 Compiler 的 run 方法
- 开始编译
- make 从入口点分析模块及其依赖的模块，创建这些模块对象
- build-module 构建模块
- after-compile 完成构建
- seal 封装构建结果
- emit 把各个 chunk 输出到结果文件
- after-emit 完成输出

webpack 调用 doBuild，对每一个 require 用对应的 loader 进行加工，最后生成一个 js module。然后调用 acorn 来解析 loader 处理后的源文件生成抽象语法树。然后遍历 AST，构建该模块所依赖的模块。重复之前的构建步骤。

在所有的模块及其依赖模块 build 完成后，webpack 会监听 seal 事件调用各插件对构建的结果进行封装，逐次对每个 module 和 chunk 进行整理，生成编译后的源码，合并，拆分，生成 hash。

然后通过调用模板进行生成。比如 require 的替换。

## 优化点

### externals

如果想将一些模块，例如 react 分离，不打包在一起，可以使用 externals。然后用 script 单独将 react 引入。

### module.noParse

针对单独的 react.min.js 这类没有依赖的模块，速度会更快

### 合并公共代码

就是使用 CommonsChunkPlugin 插件，节省空间

### 善用 alias

对于经常要被 import 和 require 的库，比如 react，我们最好直接指定他们的位置，可以省去搜索硬盘的时间。

### module.loaders

loaders 里面的 js 部分至少得配置一个 exclude 或者 include，不然速度会非常慢
