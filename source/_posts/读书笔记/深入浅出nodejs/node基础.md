---
layout: default
title: 深入浅出nodejs -- node基础
categories:
  - 读书笔记
  - 深入浅出nodejs
---

# node 基础

本文摘要了深入浅出 nodejs 的第一，二章

## Why node？

因为 Ryan 想找一个事件驱动，并且非阻塞的 IO，而且 chrome 的 V8 引擎非常强大。

node 与 chrome 很像，node 基于 V8 引擎运行 js，通过引擎控制一些中间件来控制网卡，硬盘等等的底层。

chrome 也是通过通过 V8 运行 js，通过引擎控制中间件来控制底层的网卡，硬盘。当然 chrome 还有布局引擎 webkit 来处理 html，也是由布局引擎来通过中间件控制底层的网卡，硬盘。

node 的底层 api 大都被设计为了异步的 io，这样在编程模型上可以极大的提高效率。

## 单线程

node 保持了 javascript 在浏览器单线程的特点，所以不会有死锁，不会有线程上下文交换带来的性能上的开销。

但是问题在于：

- 无法利用多核 CPU
- 一旦挂了，程序退出
- 计算太多，导致 CPU 无法继续调用异步 IO

node 的解决办法是 child_process

通过子进程可以应对健壮性和多核 CPU 的问题，通过将计算分解到各个子进程，然后通过进程间的`事件消息`来传递结果。

### Node 应用场景

毫无疑问，IO 密集型 node 非常强，因为 Node 面向网络并且擅长执行并行 IO，能够有效的组织起更多的硬件资源。

对于 CPU 密集型的应用，其实 v8 的深度优化导致计算能力实际上很强，只不过 js 为单线程应用，长时间计算会阻塞而已，但是通过拆分分解还是不错的。可以使用一些 c++的扩展方式，或者通过子进程将一部分的 node 进程当做常驻服务进行计算。

所以 CPU 密集型不可怕，合理的调度才是诀窍。

### 模块机制

模块化的出现，改变了 js 杂乱无章的现状。CommonJS 规范是为了 Javascript 能够在任何地方运行。

Node 借鉴 Commonjs 的 Modules 规范实现了一套非常易用的模块系统。

### Commonjs 的模块规范

- 模块引用

很简单，require 方法，将模块的 api 引入到上下文中

- 模块定义

上下文提供了一个 exports 对象来导出当前模块的方法或者变量。还有一个 module 对象代表模块自身。还有一个 exports 是 module 的属性，通过将方法挂载到 exports 对象上作为属性即可定义导出。

这里应该这么理解。exports = module.exports ;module.exports 是真实的要输出的东西，所以如果改变 exports 对象的执行，exports 对象就没用了。

- 模块标识

就是传递给 require 的参数，必须是小驼峰命名的字符串，或者.，..开头的相对或者绝对路径。

### Node 的模块实现

引入模块的 3 个步骤：

- 路径分析
- 文件定位
- 编译执行

Node 模块分为核心模块和用户编写的文件模块。

核心模块在编译过程中直接编译为了二进制文件，直接在 node 运行时被加入内存，所以他没有文件定位和编译执行两步，而且路径分析优先判断。加载最快。

而文件模块则需要完整的 3 个步骤，所以加载速度比较慢。

注意加载是缓存优先，require 方法对相同模块的二次加载都一律采用缓存优先，是`第一优先级`。当然核心模块缓存检查先于文件模块的缓存检查。

#### 路径分析

首先优先核心模块，直接加载，然后是路径形式和文件模块，由于给出了路径，也是最方便的查找过程，其次是自定义的模块，不是核心，也没有路径，他会从当前路径一层层向外查找，直到根目录为止，所以加载速度最慢。

#### 文件定位

分析标识符的时候，可能会不带文件扩展名，这种情况下，node 会以 js，json，node 为次序依次尝试。

    所以小诀窍是，如果是.node和.json文件，最后带上扩展名，会加快速度。

然后如果是目录分析和包的话，会找他的 package.json，然后根据 man 属性的文件名进行定位，找不到则以 index.js,index.json,index.node 的顺序来找，再找不到，就找下一层，到根目录都找不到，就抛出异常。

#### 模块编译

其实是分文件的，`.node`就直接通过 process.dlopen 来加载，底层通过 libuv 兼容层来进行了封装，json 文件就被 JSON.parse 了，其他的 js 文件其实就是进行了头尾包装，变成一种类似匿名函数的方式来保证作用域的隔离。

包装之后的代码通过 runInThisContext 方法执行（类似于 eval，不过有自己的上下文，不会污染全局）。

这里倒是解决了那个问什么会存在 exports 和 module.exports 两个东西，并且直接调用`exports=a;`会出错的问题了。

因为包装过的东西类似于

```javascript
(function(exports, require, module, __filename, __dirname) {
  exports.add = function() {};
});
```

而 exports 是个形参，直接赋值会改变形参的引用，但是无法改变作用域外的值，所以要赋值的话给 module.exports，这个迂回的方案不改变形参的引用。

### 核心模块

核心模块也分为 C/C++编写和 javascript 编写的两部分，c 的放在 Node 项目的 src，js 的放在 lib 中。

#### 核心模块编译过程

在编译所有 c/c++之前，先得把 js 编译成 c/c++。

这里介绍了不少编写 c 语言模块的，只是不是很懂，将来找机会再看吧。

基本上就是 c 负责了一些底层的模块来给上层的 js 调用。js 核心模块也分为调用 c 的和只提供纯粹的功能，不与底层打交道的模块。

### 包与 Npm

包的结构规范：

- package.json：包描述文件
- bin：用于存放可执行二进制文件的目录
- lib：放 js 代码的目录
- doc：放文档的目录
- test：存放单元测试用例的代码

#### 包描述文件

- name：小写字母和数字
- descripton
- version
- keywords：用来帮助别人搜索的
- maintainers：维护者列表，npm 根据该属性进行权限认证[{"name":"panyifei","email":"91@qq.com","web":"cc.com"}]
- contributors：贡献者列表，格式同上
- bugs：提交 bug 的邮件地址或者网页地址
- licenses：许可证列表
- repositories：源代码的位置
- dependences：依赖列表，这个比较关键
- homepage
- os：操作系统支持列表
- cpu：CPU 架构的支持列表
- engine：支持的 js 的引擎列表
- builtin：是否是内建在底层系统的标准组件
- directories：包目录说明
- implements：实现的规范列表，标识实现了 commonjs 的那些规范
- scripts：脚本说明对象，包含了 install，uninstall，test 等等，这其实是个`钩子命令`，在执行 install 的时候，preinstall 指向的会被先触发

NPM 实际实现多了 4 个：

- author：作者
- bin：这个字段设置了之后就可以作为命令行工具使用了
- main：模块引入方法 require 的时候，会优先检查这个字段，没有的话就去找 index.js,index.node,index.json 作为默认入口
- devDependencies：开发时需要的依赖

NPM 实际上是 CommonJS 包规范的一种实践。

全局模式安装

`npm install express -g`其实全局模式只是把包安装成为一个全局可用的可执行命令。

npm install 后面可以放一个包含了 package.json 的本地文件或 url 地址。

从非官方源下载

npm install underscore --registry=http://registry.url

如果以后都采用镜像的话，就

npm config set registry http://registry.url

#### 注册包仓库账号

npm adduser

注册完了之后就可以上传发布包了

#### 发布包

npm publish .

#### 管理包的权限

列出包的所有的拥有者

- npm owner ls refuseuse

添加拥有者（删除自然是 remove）

- npm owner add <user> <package>

#### 分析当前路径能够拿到某个包

直接 npm ls 可以分析路径

### 前后端共用

虽然执行环境很类似，但是前后端期望的东西不同，前端的瓶颈是带宽，后端的瓶颈是性能，如果后端页通过同步的形式加载的话，会问题比较严重，于是才有了 AMD 规范以及玉伯的 CMD 规范。

#### AMD 规范

AMD 需要 define 方法来申明一个模块，并且在申明的时候得将依赖都写进去。

CMD 的话就更类似 Conmonjs 了，使用的时候再进行 require 就行了。
