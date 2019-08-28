---
layout: default
title: CSS布局
---

## 水平居中

很简单，margin:0 aoto;

## 垂直居中

将 html 和 body 的 height 全部设置为 100%，然后把想要垂直居中的元素设置

`position:relative;top:50%;margin-top:-100px;`

这里的 100px 就是想要垂直居中的元素的高度的一半。

这里有好几种选择：

- margin-top:-100px;
- transfrom:translateY(-50%);//向上平移自身高度的一半,IE8 不支持。
- 使用 flex 弹性布局，使用 align-items 来。
- 父元素设置为 table，子元素设置为 table-cell，并不推荐。

tudo:最后一个，还有 flex 看下(http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=209323512&idx=1&sn=c2134c53bd55eef5bb977839c629b087&scene=21#wechat_redirect),还有啥方法？

inline-box 也可以
