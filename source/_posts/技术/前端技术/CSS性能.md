---
layout: default
title: CSS性能
---

写好了 css 之后可以用 csslint 跑一遍来检测下自己有哪些坏习惯，棒！

## import

页面在 stylesheets 加载完才会开始渲染整个页面。

用@import 等于就是把 link 放在网页的底部，这就需要等到整个页面加载完才会渲染，所以应该避免使用。

## expression

比如在 querySelectorAll 不支持的时候，我们可能会使用 expression 这种在 IE 才支持的东西，但是这个东西的执行频率非常高，不仅页面渲染，resize，甚至页面滚动，鼠标滑动也都会触发，所以我们尽量不要使用 expression

## filter

这个是可以解决 IE6 以前不支持半透明的 png 的，不过他的开销蛮大的，而且下载里面的图片时会冻结浏览器，停止渲染页面。建议避免使用

## CSS 缩写

写 css 的时候，我们可以尽量使用它的缩写，然后合并一些样式。

## CSS 选择器的一些优化

- 子选择器比后代选择器的效率高，这个可以支持到 IE7，基本是可用的~
  比如我们写`#toc > li`的性能就比`#toc li`的性能好，因为浏览器的 CSS 的是从右向左的，如果是子选择器，就只会遍历父元素，如果是后代选择器，就会一层层的遍历，性能就会比较差。

- 全局规则的性能很差
  `[hidden="true"] { ... }`这种全局规则更差劲，会对文档的所有层进行匹配，效率极低。

- ID 选择器或是 Class 选择器伴随着其他的规则导致效率差
  因为 ID 拥有最高的权限，伴随着其他非 ID 的选择器，反而会影响匹配的效率。Class 同样的，这种也拥有很高的权限，与其他的混用效果很差。

- 尽量减少规则数量
  就是减少 CSS 的层级了，像写 LESS 的时候就很容易嵌套多层，不如给个特殊的 class 来的效率高。

- 活用 CSS 的继承
  就是比如一些字体啊，颜色啊之类能够继承的，若是子元素没有特别的话，我们就可以定在父元素上。

所有元素可继承：visibility 和 cursor

内联元素和块元素可继承：letter-spacing、word-spacing、white-space、line-height、color、font、 font-family、font-size、font-style、font-variant、font-weight、text- decoration、text-transform、direction

块状元素可继承：text-indent 和 text-align

列表元素可继承：list-style、list-style-type、list-style-position、list-style-image

表格元素可继承：border-collapse

不可继承的：display、margin、border、padding、background、height、min-height、max-height、width、min-width、max-width、overflow、position、left、right、top、 bottom、z-index、float、clear、table-layout、vertical-align、page-break-after、 page-bread-before 和 unicode-bidi

## 小细节

- 如果值为 0 的话，我们可以不加上单位，效果会比较好。
- 写一块的时候，优先级高的写在前面，比如`#id.class`比`.class#id`的效率高。
- 平常用的 css sprites

## html 结构

CSS 是用来渲染 html 的，我们要尽量缩减 html 的结构。
