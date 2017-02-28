---
layout: default
title: {{ site.name }}
---
# webpack2
由于webpack1废弃了，项目从webpack1迁移到webpack2。

## Tree shaking
配置方法就是升级下babel，然后开启modules为false就行了，就会阻止将es6的模块转化为ES5，webpack2就可以识别了
<img alt="配置" width='400px' src="pics//1.jpg" />
然后再配置下resolve，因为现在很多模块提供了es6的版本的模块的，这样会优先使用
<img alt="配置" width='200px' src="pics//2.jpg" />
使用效果如下，我在time-span里面多export了一个function bda
<img alt="效果" width='300px' src="pics//3.jpg" />
然后webpack打包的结果如下
<img alt="效果" width='300px' src="pics//4.jpg" />
会发现webpack只export了一个timespan。然后调用生产环境的压缩，可以发现得到的结果已经没有"哈哈哈"这个字符串了。
<img alt="效果" width='300px' src="pics//5.jpg" />


tree shaking不是webpack分析阶段就直接删除代码的，得配合一定的压缩方式才能起到压缩代码的作用。并且只识别es6 module的语法，只能识别一层，而且如果代码有副作用的话是不会被移除的。

我们的代码大量都是commonjs的，无法执行tree shaking进行静态分析，少量es6模块的写法，也很少有冗余代码，所以效果这次应该不会很明显。下面是线上以及webpack2压缩的对比图，就多压缩了6%左右。

## 踩到的坑

 - babel需要升级，babel-core升级到了6.23.1，babel-loader也升级了版本
 - loader的“-loader”后缀webpack2不推荐省略了，加上之后发现我们引用到的dpapp-share被转化后写死了file的loader，最后发现webpack2可以配置“resolveLoader”来解决这个问题
 - loader-utils升级到0.2.16解决了一个引用失败的问题
 - 之前使用gulp调用gulp-webpack来使用webpack的，由于这个插件不支持webpack2，于是切换成webpack-stream来调用。
 - extract-text-webpack-plugin也需要升级版本，改了下调用的方式，webpack2官方文档有
 - 因为每次新加入文件的话，commons里面都会被修改到，于是用一个空的文件来隔离开易变的那部分，之前是在entry里申明的空数组，webpack2不支持空数组了，于是新建了一个文件。
 - 开启了tree shaking之后，发现有些文件写的不规范，混用了es6 module和commonjs，之前webpack会全部转化为commonjs，所以没有暴露出问题。
 - webpack2的preloader必须得在rules里面配置，并设置为enforce:'pre'，另外webpack2不支持自定义的config了，eslint的参数得配置在query里面。
 - 其他的就是一些配置的改变了，比如postcss不支持写在最外层了，"loaders"改为"rules"，"query"改为"options"。
