---
layout: default
title: Webpack文档阅读
---

虽然 webpack 已经用了蛮久了，这次系统的看一下他的文档。

- 插件：它具有丰富的插件接口，可以让外部做一些插件。这让 webpack 可扩展性。
- 加载器：通过 loader 来对文件进行预编译，这就意味着可以对任意的静态资源进行打包。可以很容易的写自己的 loader
- 代码分割：允许将代码库分割成大块，这样就可以减少最初的加载时间
- 开发工具：支持 sourceUrl 和 sourceMap，他可以监视你的文件，通过一个开发中间件或者开发 server 来自动重新渲染
- 表现：webpack 使用了异步的 IO，并且有多层的缓存等级，让 webpack 很快并且在增量编译的时候很快
- 支持：支持 AMD 和 Commonjs，能在分析你的代码的 AST 的时候表现的很聪明，甚至有一个分析的引擎
- 优化：做了很多优化来减少打包的最后的大小，通过 hash 来关心请求被缓存
- 多种目标：webpack 的主要目标是 web，也提供了 bundle 为了 webworker 和 nodejs。

## 动机

页面上的 code 越来越多，需要被组织。文件系统提供了把你代码分成模块。

### 模块系统风格

定义依赖，输出结果又多种标准的：

- 直接 script，没有模块系统(自己管理好加载顺序，全局可能会冲突，用户自己处理依赖，大项目很难维护)
- Commonjs(同步依赖，然而网络请求都是异步的)
- AMD 等等(编码要求比较高，看上去像是某种修补)
- ES6 的模块系统(本地浏览器实现需要时间，这种分格的 js 很少)

### 传输

现在每个模块一次 request，或者所有的 module 合为一个请求都是存在的，webpack 把代码分割成块状，提高第一次渲染的速度，然后按需引其他剩下的 js。

### 为什么只是 JS 呢

就是说不只是 js，其他的静态资源都是需要处理的，最明显的就是 css，可能存在 less 变成 css 的过程。而且图片啥的，jade 模板啥的都需要一个处理的过程。

## webpack 是个啥

webpack 是个文件打包器，就是把一坨相互依赖的静态资源模块，包括各种语言的写法。打包成 js，css，png 这种浏览器直接能使用的资源。

出现这个新的模块打包器的主要原因是代码分割以及静态资源必须模块化的无缝的连接在一起。

### 目标：

- 分离依赖树成块状的，然后按需加载
- 让 loading 时间尽可能短
- 每个静态资源都能成为模块
- 能够整合第三方的库作为模块
- 能够定制模块加载器的每一个部分
- 适合于大项目

### webpack 为什么不同

#### 文件分割

webpack 有在他的依赖树种有两种依赖：同步的和异步的。异步的依赖生成了一个新的代码块。在新的代码块被优化后，一个文件被发散出去。

## Code Splitting

对于大的 web app 项目来说，将所有的代码推入一个文件是效率不高的。尤其是一些代码块只在特定的场景才需要被引用。webpack 拥有把你的代码分成块状并且按需要加载的能力。别的打包器把这个叫做 layer，rollups，fragments。这个功能叫做代码分割。

这是一个可选的功能，可以在代码库中定义分离的点。webpack 来负责处理依赖，输出文件以及运行时的材料。

来声明一个经常的误解：代码分割不仅仅是把普通的代码变成可共享的代码块。更值得关注的功能是代码分割可以把代码分成按需加载的代码块。这就让首次的下载尽可能小。并且可以在需要的时候按需加载。

### 定一个分隔的点

AMD 和 Commonjs 定义了不同的方法来按需加载代码，都是支持的。

Commonjs：require.ensure

```javascript
require.ensure(["moduleA", "moduleB"], function(require) {
  var a = require("moduleA");
});
```

AMD 的话就是本身的 require 就是支持的。

ES6 的模块的话，webpack1.x.x 是没有原生支持的，2.0.0 支持。所以只能通过 babel 将 ES6 的模块转化成 Commonjs 或者 AMD 的模块。这个方法有效果但是对于动态加载有一些警告。

模块语法 import x from 'foo'是故意设计来静态分析的，这就意味着没法做动态的引用。

幸运的是，有一个 js 的 api“loader”专门是写来处理动态使用的例子的。“System.load”。这个 API 将会 native 地等价于上面的 require 方法。但是，大多数编译器都没法处理这个变成 require。所以如果我们想要动态的代码分割，我们就得直接来写。

### 代码块内容

所有的在分割点的依赖都会打进一个新的代码块中，递归的依赖也会被打进 chunk 中。

如果你在分割点传入一个 callback，webpack 也会自动将这个 callback 的所有依赖打进 chunk。

### 代码块优化

如果两个代码块包含同一个模块，他们会被和到一个里面，这会导致代码块拥有多个父辈。

如果一个模块在代码块的所有父辈中都可以访问到，他会被从代码块中移出。

如果一个代码块包含另一个代码块的所有模块，他会被存储。他实现了多重的代码块。

### 代码块加载

取决于配置项 target，一个为了代码块加载的运行时的逻辑会被添加进 bundle 中。例如，web 目标的代码块会被通过 jsonp 加载。一个代码块只被 load 一次，平行的请求会被合进一个里面。运行时会检测加载的代码块来看他们是否导致了多重的代码块。

### 代码块的种类

#### 入口代码块

入口代码块含有一个运行时加上一系列的模块。如果代码块包含模块 0，运行时就会执行他。如果不包含，就等待包含了模块 0 的代码块，然后执行他。（每次包含模块 0）

#### 一般模块

一般模块不包含运行时，他只包含了一些模块，他的结构取决于模块加载算法。比如，jsonp 的模块就会包含在 jsonp 的回调中。这个代码块也包含他需要的一系列的代码块的 id。

#### 初始模块

初始模块是一个一般模块，唯一的区别在于优化把他看的更重要，因为他意味着初始加载时间。代码块种类可以在 CommonsChunkPlugin 融合的过程中发生。

#### 分离代码和供应代码

把你的 app 分成 2 个文件，比如叫做 app.js 和 vendor.js。然后把名字传给 CommonsChunkPlugin 这个插件。

这样子的话就会将所有的 vendor 中的模块从 app 中删去，这样，得到的 bundle.js 就会只含有你的 app 的 code。不会包含他的依赖。当然引入的时候得先引入那个 vendor 包。

#### 多个入口代码块

可能需要配置多个入口点会导致多个入口代码块。入口代码块包含着运行态，并且每个单页面都只能包含一个运行态。

#### 运行多个入口点

由于 CommonsChunkPlugin，运行时其实已经进入了 commons 的代码块中了。入口点现在在初始化代码块中。尽管只有一个初始代码块可以被加载，但是多个入口代码块可以被加载。这样在一个页面就可以有多个入口点了。

#### Commons 代码块

CommonsChunkPlugin 把依赖的代码移到了一个新的入口代码块，运行时也进了代码块。这意味着老的入口代码块现在是初始化代码块了。

#### 优化

有些优化的插件可以取决于一些特殊的标准来合并代码块。

#### 命名代码块

require.ensure 方法接收一个增加的额外的第三个参数，如果两个分离点传同一个 string，意味着他们使用同一个模块。

#### require.include

require.include 是一个 webpack 的特性的函数。他能添加一个模块进当前的代码块中。但是不评估他。(申明会从 bundle 中删去)

当一个模块存在于多个子代码块的时候，require.include 是挺好用的。在父代码块中，require.include 将会包含这个模块，而子代码块中的模块实例将会消失。

## configuration

webpack 其实是一个配置对象。取决于你的 webpack 的用法，有两种方式来传递这个配置对象。

### CLI 与 nodejs API

如果你使用 CLI，他将会读一个文件 webpack.config.js，或者通过--config 传入的文件。这个文件将会导出配置对象。`module.exports`

如果你使用 nodejs API，你需要传这个配置对象作为参数。webpack({//configuration},callback)

在两种 case 下，你都可以使用数组化的配置，并行执行。他们共享文件系统的缓存和观察者，所以这比多次调用 webpack 更加高效。

### 配置对象内容

    记住我们并不需要写纯净的JSON进配置中。使用任何你想要的JS，他只是一个nodejs的模块。

#### context

就是处理 entry 的基础目录，如果 output.pathinfo 被设置了，包含的 pathinfo 是对这个目录的缩写。

#### entry

bundle 的入口文件，如果你传一个 string，这个字符就会被解析为模块加载时启动。如果你传了一个数组，所有的模块会在启动时加载，最后一个被 export。如果你传了一个对象，会有多个入口 bundle，key 是模块名。

#### output

影响编译输出的配置项。output 告诉了 webpack 如何去写编译的文件到 disk 上。注意尽管有多个 entry 的点，只有一个 output 的配置。如果你使用了任何的散列来让模块一定有一个一致的排序，使用 OccurenceOrderPlugin 或者 recordsPath。

- output.filename：指定每个输出文件在磁盘上的名称，你不能在这里指定一个绝对路径
- output.path：决定了文件被写入的磁盘的位置
- output.filename：仅用于命名的文件名
- output.publicPath：用于规定页面上的公共资源，比如 js，css，img 的路径，因为可能会需要放置到不同的 domain 或者 CDN。
- output.chunkFilename：无入口的 chunk 的 name，相对于 path
- output.sourceMapFilename：js 文件的 sourcemap 的文件名。default：[file].map

接下来还有一堆先不看了

如果你的配置创建了多于一个块你应该使用下面的替换，来保证每个文件有一个独一无二的名字。[name]会被 chunk 的 name 替换，[hash]会被编译的 hash 替换，[chunkhash]被 chunk 的 hash 替换

#### module

module.loaders：自动应用的加载器数组，每个 item 都有下面的属性：

- test：必须满足的条件，正则
- exclude：必须不满足的条件
- include：必须满足的条件
- loader：一个以`!`分隔的 loaders
- loaders：loader 的字符串数组

其他的内容先不管

#### resolve

影响了模块的解析

- root：包含了你的模块的`绝对路径`，可能是一个 array，这个用来添加独立的目录进搜索路径
- modulesDirectories：这里传的是如何 node 去找到 node_modules 文件夹，如果我想要处理的话，感觉加个 neurons，然后加个 webpack 的插件应该可以搞定。
- fallback：一个文件夹，webpack 将会去查找模块，当没法在 root 或者 modulesDirectories 里面寻找到的时候提供了一个 fallback

#### externals (懂了)

指定依赖项不应该被 webpack 处理，但是应该成为 bundle 的依赖。依赖的种类取决于'output.libraryTarget'

    这个其实很简单，页面可能已经通过script的方式引入了某个类库，但是我们使用的时候并不想通过全局变量来引用，于是我们配置了externals以及那个类库的引入方法之后，就可以在代码里面进行require了。

#### bail（懂了）

这个是运行 webpack 的时候作为参数带着 --bail

    就是编译错误的时候会把报错信息显示的更加详细

#### profile （懂了）

这个是运行 webpack 的时候作为参数带着 --profile

    会把每个模块的时间信息打印出来

#### cache

缓存生成模块和 chunk 来提高多个增量构建的性能，在 watch 模式被默认开启，可以传 false 来阻止。

#### debug

切换 loader 到开发模式

#### devtool （懂了）

选择一个开发工具来改善 debug，就是选一种 sourcemap，其实很简单就能开启。

#### devServer（懂了）

其实就是热部署的一个配置项

## Loaders

loaders 允许你预处理文件，你需要使用 require 或者 load 他们。Loaders 就像是其他构建工具的 tasks。提供了一个强大的方式来处理前端构建步骤。loaders 能够转换不同的语言。loader 甚至允许你进行 css 的 require。

告知 webpack 进行 loader 的应用，你可以在 config 里面写好，或者在 require 的时候写明。

当链式调用 loader 的时候，顺序是从右向左的。

## loader order

在文件从文件系统读出来之后，loaders 会以下面的顺序执行。

- config 里面的 preloader
- config 里面的 loaders
- 在 require 里面申明的 loaders
- config 里面的 postloaders

我们在 require 里面可以通过添加前缀来取消一些 loader 的执行。比如` !``!!``-! `

## HOW TO WRITE A LOADER

一个 loader 就是一个 export 一个 function 的 node 模块。

这个方法会在资源需要被转化的时候被调用。

在这个简单的 case 中，当一个简单的 loader 被应用到资源上。这个 loader 被传入这个资源的文本作为一个 string 参数调用。

这个 loader 可以在函数中通过 this 这个参数得到 loader api。

一个同步的 loader 只希望得到一个简单返回的 string，在其他任意的 case 中，loader 都返回任意数量的 value 通过 this.callback。错误也是 this.callback 来返回或者通过一个同步的 loader 返回。

loader 希望返回一到两个值，第一个值是 js code 作为 string 或者 buffer。第二个可选的 value 是一个 sourcemap 作为 js 对象。

在复杂的 case 中，当多个 loader 被链式调用，只有最后的 loader 拿到资源文件，只有第一个 loader 希望返回一到两个值。

### Guidelines

#### do only a single task

loader 可以被链式调用，为每一步创建 loader，而不是一个 loader 一次性做所有的事情。这也意味着如果不是必要的话他们不该被转化为 js。例子：通过应用查询参数来从模板里渲染 html。可以写一个 loader 来从 source 中编译，执行他，然后返回一个包含了 HTML code 的字符串。我们应该在这种使用过程中为了每个 task 写 loader 并且管道应用他们。

- jade-loader：将模板转化为一个抛出方法的模块
- apply-loader：通过应用查询参数，返回结果
- html-loader：接受 html，返回一个字符串的 export 模块

#### generate modules that are modular

loader 生成模块必须像是正常的模块一样期望同样的设计原则。

#### flag itself cacheable if possible

大多数 loader 都是可以被缓存的，所以他们需要 flag 他们自己成可缓存的，直接调用 cacheable 就行了。

### not keep state between runs and modules

loader 应该独立于其他的模块编译。loader 应该独立于同一个模块的前一次编译

### mark dependences

如果一个 loader 依赖了其他的资源，比如从文件系统中读取，他必须被通知到。这个信息用来缓存失效机制以及在 watch 模式下重新编译

就是调用 addDependency 这个方法

### resolve dependences

在许多语言中，有一些模式来指定依赖项，例如，在 css 中有@import 和 url。这些依赖应该由模块系统来处理，现在有两个选择：

- 将他们都转化为 require
- 使用 this.resolve 来处理路径

## HOW TO ARITE A PLUGIN

插件向第三方开发者暴露了 webpack 引擎的的全部潜力。使用构建的回调，开发者可以在 webpack 的构建过程中引入他们自己的行为。构建插件比构建 loader 更加先进一些，因为你需要去理解一些 webpack 的底层的钩子。准备好去阅读一些源码。

### 编译器和编译过程

开发插件的过程中最重要的两个资源是 compiler 和 compilation。理解他们的角色是扩展 webpack 引擎的重要的第一步。

- compiler 对象代表了完整的 webpack 的配置环境，这个对象在开始 webpack 的时候被构建一次，并且是被那些 options，loaders 和 plugins 所一起配置的。当对 webpack 环境应用一个插件的时候，这个插件将会接收到这个 compiler 的引用。使用这个 compiler 来访问主要的 webpack 环境。
- compilation 对象代表了版本资源的单次的 build。当运行 webpack 开发中间件的时候，每次当一个文件改变的时候，一个新的 compliation 将会被创建，从而生成一组编译资源。一个 compilation 表面信息是关于模块资源的当前状态，编制资产，改变的文件以及查看依赖。compilation 也提供了许多的 callback 点以供执行自定义操作。

### 基本的插件结构

插件是在原型链上拥有 apply 方法的实例对象。apply 方法在 webpack compiler 安装这个插件的时候被执行一次。apply 方法给予了底层 webpack 编译器的引用，提供了 compiler callback 的访问。

### 访问 compilation

使用 compiler 对象，你可以绑定对每次 compilation 都提供了引用的回调。这些 compilation 提供了许多构建过程的步骤的回调。
