---
layout: default
title: Webpack
---

## 新一代的前端构建工具

好吧，gulp 感觉还没用多久呢，怎么 Webpack 又突然火了呢..

## 使用初步小结

初次使用是配合 react,对于 less 文件也可以进行 require 操作而进行打包感觉非常奇特，只需要在配置文件定好的 entry 中 require 需要的 less 文件，然后再配置文件的 module 的写一个 loader：`style-loader!css-loader!less-loader`就可以了。

## less-loader 的小 bug

居然 right: -1px\0;这种语法回报错误！！
