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

## 优化点
