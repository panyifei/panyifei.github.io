---
layout: default
title: \{#\{ site.name }}
---
# Eslint
目前代码用了地狱级别的Eslint，一些自己容易犯的错这里记录一下

## reassign param
函数的参数如果传入了一个对象，Eslint并不希望他被修改

## es6 的语法
比如 {item:item},eslint希望写成 {item}

## 每行字数限制
eslint每行字数限制了120，超过的话得想办法换行

## 某行的代码不想经过eslint
加上后面的注释就行了`// eslint-disable-next-line`

## 是时候具体看下规范了
### react/prop-types
这是个react的propTypes的检测，还挺好使的，主要是通过验证接受的props来提高你的组件的可重用性
