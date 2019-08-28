---
layout: default
title: webpack2
---

由于 webpack1 废弃了，项目从 webpack1 迁移到 webpack2。

## Tree shaking

配置方法就是升级下 babel，然后开启 modules 为 false 就行了，就会阻止将 es6 的模块转化为 ES5，webpack2 就可以识别了
<img alt="配置" width='400px' src="pics//1.jpg" />
然后再配置下 resolve，因为现在很多模块提供了 es6 的版本的模块的，这样会优先使用
<img alt="配置" width='200px' src="pics//2.jpg" />
使用效果如下，我在 time-span 里面多 export 了一个 function bda
<img alt="效果" width='300px' src="pics//3.jpg" />
然后 webpack 打包的结果如下
<img alt="效果" width='300px' src="pics//4.jpg" />
会发现 webpack 只 export 了一个 timespan。然后调用生产环境的压缩，可以发现得到的结果已经没有"哈哈哈"这个字符串了。
<img alt="效果" width='300px' src="pics//5.jpg" />

tree shaking 不是 webpack 分析阶段就直接删除代码的，得配合一定的压缩方式才能起到压缩代码的作用。并且只识别 es6 module 的语法，只能识别一层，而且如果代码有副作用的话是不会被移除的。

我们的代码大量都是 commonjs 的，无法执行 tree shaking 进行静态分析，少量 es6 模块的写法，也很少有冗余代码，所以效果这次应该不会很明显。下面是线上以及 webpack2 压缩的对比图，就多压缩了 6%左右。

## 踩到的坑

- babel 需要升级，babel-core 升级到了 6.23.1，babel-loader 也升级了版本
- loader 的“-loader”后缀 webpack2 不推荐省略了，加上之后发现我们引用到的 dpapp-share 被转化后写死了 file 的 loader，最后发现 webpack2 可以配置“resolveLoader”来解决这个问题
- loader-utils 升级到 0.2.16 解决了一个引用失败的问题
- 之前使用 gulp 调用 gulp-webpack 来使用 webpack 的，由于这个插件不支持 webpack2，于是切换成 webpack-stream 来调用。
- extract-text-webpack-plugin 也需要升级版本，改了下调用的方式，webpack2 官方文档有
- 因为每次新加入文件的话，commons 里面都会被修改到，于是用一个空的文件来隔离开易变的那部分，之前是在 entry 里申明的空数组，webpack2 不支持空数组了，于是新建了一个文件。
- 开启了 tree shaking 之后，发现有些文件写的不规范，混用了 es6 module 和 commonjs，之前 webpack 会全部转化为 commonjs，所以没有暴露出问题。
- webpack2 的 preloader 必须得在 rules 里面配置，并设置为 enforce:'pre'，另外 webpack2 不支持自定义的 config 了，eslint 的参数得配置在 query 里面。
- 其他的就是一些配置的改变了，比如 postcss 不支持写在最外层了，"loaders"改为"rules"，"query"改为"options"。
