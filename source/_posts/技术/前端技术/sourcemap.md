---
layout: default
title: sourcemap
---

知道 sourcemap 是用来 debug 用的，但是对于他的文件结构一直没有去熟悉下。js 脚本出于以下 3 个原因会进行源码的转换。

- 压缩，减小体积，
- 多个文件的合并，减少 HTTP 请求数
- 其他的语言编译为 js，比如 coffee，比如 jsx

## sourcemap 是什么

就是一个信息文件，里面储存着位置信息。转换后的代码的每一个位置，所对应到的转换前的位置。

### 启用 sourcemap

在转化后的代码尾部，加上一行

    //@  sourceMappingURL=/path/to/file.js.map

### 如何生成 source map

比较常用的就是 Google 的 Closure 编译器。其实大部分工具都是提供了生成方式的

### source map 格式

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

- version:source map 的版本，目前是 3
- file：转换后的文件名
- sourceRoot：转换前的文件所在的目录，如果与转换前文件在同一目录，该项为空
- sources：转换前的文件，是一个数组，表示可能存在多个文件合并
- names：转换前的所有变量以及属性名
- mappings：记录位置信息的字符串
- sourcesContent：资源的真实内容

### mappings

就是两个文件的各个位置是如何一一对应的。
