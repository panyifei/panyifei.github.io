---
layout: default
title: {{ site.name }}
---
# sourcemap
知道sourcemap是用来debug用的，但是对于他的文件结构一直没有去熟悉下。js脚本出于以下3个原因会进行源码的转换。

 - 压缩，减小体积，
 - 多个文件的合并，减少HTTP请求数
 - 其他的语言编译为js，比如coffee，比如jsx

## sourcemap是什么
就是一个信息文件，里面储存着位置信息。转换后的代码的每一个位置，所对应到的转换前的位置。

### 启用sourcemap
在转化后的代码尾部，加上一行

    //@  sourceMappingURL=/path/to/file.js.map

### 如何生成source map
比较常用的就是Google的Closure编译器。其实大部分工具都是提供了生成方式的

### source map格式

```javascript
{
　　version : 3,
　　file: "out.js",
　　sourceRoot : "",
　　sources: ["foo.js", "bar.js"],
　　names: ["src", "maps", "are", "fun"],
　　mappings: "AAgBC,SAAQ,CAAEA"
}
```

 - version:source map的版本，目前是3
 - file：转换后的文件名
 - sourceRoot：转换前的文件所在的目录，如果与转换前文件在同一目录，该项为空
 - sources：转换前的文件，是一个数组，表示可能存在多个文件合并
 - names：转换前的所有变量以及属性名
 - mappings：记录位置信息的字符串
 - sourcesContent：资源的真实内容

### mappings
就是两个文件的各个位置是如何一一对应的。
