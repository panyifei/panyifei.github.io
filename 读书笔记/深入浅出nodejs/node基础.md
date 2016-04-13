# node基础
本文摘要了深入浅出nodejs的第一，二章
## Why node？
因为Ryan想找一个事件驱动，并且非阻塞的IO，而且chrome的V8引擎非常强大。

node与chrome很像，node基于V8引擎运行js，通过引擎控制一些中间件来控制网卡，硬盘等等的底层。

chrome也是通过通过V8运行js，通过引擎控制中间件来控制底层的网卡，硬盘。当然chrome还有布局引擎webkit来处理html，也是由布局引擎来通过中间件控制底层的网卡，硬盘。

node的底层api大都被设计为了异步的io，这样在编程模型上可以极大的提高效率。

## 单线程
node保持了javascript在浏览器单线程的特点，所以不会有死锁，不会有线程上下文交换带来的性能上的开销。

但是问题在于：

 - 无法利用多核CPU
 - 一旦挂了，程序退出
 - 计算太多，导致CPU无法继续调用异步IO

node的解决办法是child_process

通过子进程可以应对健壮性和多核CPU的问题，通过将计算分解到各个子进程，然后通过进程间的`事件消息`来传递结果。  

### Node应用场景
毫无疑问，IO密集型node非常强，因为Node面向网络并且擅长执行并行IO，能够有效的组织起更多的硬件资源。

对于CPU密集型的应用，其实v8的深度优化导致计算能力实际上很强，只不过js为单线程应用，长时间计算会阻塞而已，但是通过拆分分解还是不错的。可以使用一些c++的扩展方式，或者通过子进程将一部分的node进程当做常驻服务进行计算。

所以CPU密集型不可怕，合理的调度才是诀窍。

### 模块机制
模块化的出现，改变了js杂乱无章的现状。CommonJS规范是为了Javascript能够在任何地方运行。

Node借鉴Commonjs的Modules规范实现了一套非常易用的模块系统。

### Commonjs的模块规范

 - 模块引用

很简单，require方法，将模块的api引入到上下文中

 - 模块定义

上下文提供了一个exports对象来导出当前模块的方法或者变量。还有一个module对象代表模块自身。还有一个exports是module的属性，通过将方法挂载到exports对象上作为属性即可定义导出。

这里应该这么理解。exports = module.exports ;module.exports是真实的要输出的东西，所以如果改变exports对象的执行，exports对象就没用了。

 - 模块标识

 就是传递给require的参数，必须是小驼峰命名的字符串，或者.，..开头的相对或者绝对路径。

 ### Node的模块实现
 引入模块的3个步骤：

  - 路径分析
  - 文件定位
  - 编译执行

Node模块分为核心模块和用户编写的文件模块。

核心模块在编译过程中直接编译为了二进制文件，直接在node运行时被加入内存，所以他没有文件定位和编译执行两步，而且路径分析优先判断。加载最快。

而文件模块则需要完整的3个步骤，所以加载速度比较慢。

注意加载是缓存优先，require方法对相同模块的二次加载都一律采用缓存优先，是`第一优先级`。当然核心模块缓存检查先于文件模块的缓存检查。

#### 路径分析
首先优先核心模块，直接加载，然后是路径形式和文件模块，由于给出了路径，也是最方便的查找过程，其次是自定义的模块，不是核心，也没有路径，他会从当前路径一层层向外查找，直到根目录为止，所以加载速度最慢。

#### 文件定位
分析标识符的时候，可能会不带文件扩展名，这种情况下，node会以js，json，node为次序依次尝试。

    所以小诀窍是，如果是.node和.json文件，最后带上扩展名，会加快速度。

然后如果是目录分析和包的话，会找他的package.json，然后根据man属性的文件名进行定位，找不到则以index.js,index.json,index.node的顺序来找，再找不到，就找下一层，到根目录都找不到，就抛出异常。

#### 模块编译
其实是分文件的，`.node`就直接通过process.dlopen来加载，底层通过libuv兼容层来进行了封装，json文件就被JSON.parse了，其他的js文件其实就是进行了头尾包装，变成一种类似匿名函数的方式来保证作用域的隔离。

包装之后的代码通过runInThisContext方法执行（类似于eval，不过有自己的上下文，不会污染全局）。

这里倒是解决了那个问什么会存在exports和module.exports两个东西，并且直接调用`exports=a;`会出错的问题了。

因为包装过的东西类似于

```javascript
(function(exports,require,module,__filename,__dirname){
  exports.add = function(){}
})
```

而exports是个形参，直接赋值会改变形参的引用，但是无法改变作用域外的值，所以要赋值的话给module.exports，这个迂回的方案不改变形参的引用。

### 核心模块
核心模块也分为C/C++编写和javascript编写的两部分，c的放在Node项目的src，js的放在lib中。

#### 核心模块编译过程
在编译所有c/c++之前，先得把js编译成c/c++。

这里介绍了不少编写c语言模块的，只是不是很懂，将来找机会再看吧。

基本上就是c负责了一些底层的模块来给上层的js调用。js核心模块也分为调用c的和只提供纯粹的功能，不与底层打交道的模块。

### 包与Npm
包的结构规范：

 - package.json：包描述文件
 - bin：用于存放可执行二进制文件的目录
 - lib：放js代码的目录
 - doc：放文档的目录
 - test：存放单元测试用例的代码

#### 包描述文件
 - name：小写字母和数字
 - descripton
 - version
 - keywords：用来帮助别人搜索的
 - maintainers：维护者列表，npm根据该属性进行权限认证[{"name":"panyifei","email":"91@qq.com","web":"cc.com"}]
 - contributors：贡献者列表，格式同上
 - bugs：提交bug的邮件地址或者网页地址
 - licenses：许可证列表
 - repositories：源代码的位置
 - dependences：依赖列表，这个比较关键
 - homepage
 - os：操作系统支持列表
 - cpu：CPU架构的支持列表
 - engine：支持的js的引擎列表
 - builtin：是否是内建在底层系统的标准组件
 - directories：包目录说明
 - implements：实现的规范列表，标识实现了commonjs的那些规范
 - scripts：脚本说明对象，包含了install，uninstall，test等等，这其实是个`钩子命令`，在执行install的时候，preinstall指向的会被先触发

NPM实际实现多了4个：

 - author：作者
 - bin：这个字段设置了之后就可以作为命令行工具使用了
 - main：模块引入方法require的时候，会优先检查这个字段，没有的话就去找index.js,index.node,index.json作为默认入口
 - devDependencies：开发时需要的依赖

NPM实际上是CommonJS包规范的一种实践。

全局模式安装

`npm install express -g`其实全局模式只是把包安装成为一个全局可用的可执行命令。

npm install 后面可以放一个包含了package.json的本地文件或url地址。

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

添加拥有者（删除自然是remove）

 - npm owner add <user> <package>

#### 分析当前路径能够拿到某个包
直接npm ls可以分析路径

### 前后端共用
虽然执行环境很类似，但是前后端期望的东西不同，前端的瓶颈是带宽，后端的瓶颈是性能，如果后端页通过同步的形式加载的话，会问题比较严重，于是才有了AMD规范以及玉伯的CMD规范。

#### AMD规范
AMD需要define方法来申明一个模块，并且在申明的时候得将依赖都写进去。

CMD的话就更类似Conmonjs了，使用的时候再进行require就行了。
