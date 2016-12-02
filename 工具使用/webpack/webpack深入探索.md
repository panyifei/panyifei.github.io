---
layout: default
title: {{ site.name }}
---
# webpack深入探索
## resolve
只要把node_modules路径添加到resolve里面的root里面，就可以直接load npm模块了。

## loader
这个是个流式的操作，可以理解为pipe，从右向左执行。

## 资源依赖处理
打包的最后是一个匿名自执行函数。感觉主要就是一个__webpack_require__函数，很easy嘛。找机会看看代码。

webpack把资源重新编号，每一个资源都成为一个模块。对应一个ID。

比如`url?limit=10000&name=img/[hash:8].[name].[ext]`的意思是小于10KB的时候会自动转为base64，可以减少一个HTTP请求。如果大于10KB，就会加上8位的hash，保证即时更新。

## 编译输出
3个概念：

 - 模块：各种资源文件，一切资源都是模块
 - entry：一个或者多个资源合并，由html通过script引入
 - chunk：被entry引入的额外的代码块，可以包含一个或者多个文件(其实就是code spliting的部分嘛)

## webpack的整体执行过程

 - 输入webpack之后，会调用wepack的bin里面的命令，将shell脚本以及config里面的参数进行合并，然后传到下一个流程的控制对象。
 - 开始执行webpack最漫长的一步，真正的webpack对象刚刚被初始化。
 - 实际入口是Compiler的run方法
  - 开始编译
  - make从入口点分析模块及其依赖的模块，创建这些模块对象
  - build-module 构建模块
  - after-compile 完成构建
  - seal 封装构建结果
  - emit 把各个chunk输出到结果文件
  - after-emit 完成输出

webpack调用doBuild，对每一个require用对应的loader进行加工，最后生成一个js module。然后调用acorn来解析loader处理后的源文件生成抽象语法树。然后遍历AST，构建该模块所依赖的模块。重复之前的构建步骤。

在所有的模块及其依赖模块build完成后，webpack会监听seal事件调用各插件对构建的结果进行封装，逐次对每个module和chunk进行整理，生成编译后的源码，合并，拆分，生成hash。

然后通过调用模板进行生成。比如require的替换。

## 优化点
### externals
如果想将一些模块，例如react分离，不打包在一起，可以使用externals。然后用script单独将react引入。

### module.noParse
针对单独的react.min.js这类没有依赖的模块，速度会更快

### 合并公共代码
就是使用CommonsChunkPlugin插件，节省空间

### 善用alias
对于经常要被import和require的库，比如react，我们最好直接指定他们的位置，可以省去搜索硬盘的时间。

### module.loaders
loaders里面的js部分至少得配置一个exclude或者include，不然速度会非常慢
