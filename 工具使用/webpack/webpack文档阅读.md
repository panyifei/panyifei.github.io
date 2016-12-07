---
layout: default
title: {{ site.name }}
---
# Webpack文档阅读
虽然webpack已经用了蛮久了，这次系统的看一下他的文档。

 - 插件：它具有丰富的插件接口，可以让外部做一些插件。这让webpack可扩展性。
 - 加载器：通过loader来对文件进行预编译，这就意味着可以对任意的静态资源进行打包。可以很容易的写自己的loader
 - 代码分割：允许将代码库分割成大块，这样就可以减少最初的加载时间
 - 开发工具：支持sourceUrl和sourceMap，他可以监视你的文件，通过一个开发中间件或者开发server来自动重新渲染
 - 表现：webpack使用了异步的IO，并且有多层的缓存等级，让webpack很快并且在增量编译的时候很快
 - 支持：支持AMD和Commonjs，能在分析你的代码的AST的时候表现的很聪明，甚至有一个分析的引擎
 - 优化：做了很多优化来减少打包的最后的大小，通过hash来关心请求被缓存
 - 多种目标：webpack的主要目标是web，也提供了bundle为了webworker和nodejs。

## 动机
页面上的code越来越多，需要被组织。文件系统提供了把你代码分成模块。

### 模块系统风格
定义依赖，输出结果又多种标准的：

 - 直接script，没有模块系统(自己管理好加载顺序，全局可能会冲突，用户自己处理依赖，大项目很难维护)
 - Commonjs(同步依赖，然而网络请求都是异步的)
 - AMD等等(编码要求比较高，看上去像是某种修补)
 - ES6的模块系统(本地浏览器实现需要时间，这种分格的js很少)

### 传输
现在每个模块一次request，或者所有的module合为一个请求都是存在的，webpack把代码分割成块状，提高第一次渲染的速度，然后按需引其他剩下的js。

### 为什么只是JS呢
就是说不只是js，其他的静态资源都是需要处理的，最明显的就是css，可能存在less变成css的过程。而且图片啥的，jade模板啥的都需要一个处理的过程。

## webpack是个啥
webpack是个文件打包器，就是把一坨相互依赖的静态资源模块，包括各种语言的写法。打包成js，css，png这种浏览器直接能使用的资源。

出现这个新的模块打包器的主要原因是代码分割以及静态资源必须模块化的无缝的连接在一起。

### 目标：

 - 分离依赖树成块状的，然后按需加载
 - 让loading时间尽可能短
 - 每个静态资源都能成为模块
 - 能够整合第三方的库作为模块
 - 能够定制模块加载器的每一个部分
 - 适合于大项目

### webpack为什么不同
#### 文件分割
webpack有在他的依赖树种有两种依赖：同步的和异步的。异步的依赖生成了一个新的代码块。在新的代码块被优化后，一个文件被发散出去。




## Code Splitting
对于大的web app项目来说，将所有的代码推入一个文件是效率不高的。尤其是一些代码块只在特定的场景才需要被引用。webpack拥有把你的代码分成块状并且按需要加载的能力。别的打包器把这个叫做layer，rollups，fragments。这个功能叫做代码分割。

这是一个可选的功能，可以在代码库中定义分离的点。webpack来负责处理依赖，输出文件以及运行时的材料。

来声明一个经常的误解：代码分割不仅仅是把普通的代码变成可共享的代码块。更值得关注的功能是代码分割可以把代码分成按需加载的代码块。这就让首次的下载尽可能小。并且可以在需要的时候按需加载。

### 定一个分隔的点
AMD和Commonjs定义了不同的方法来按需加载代码，都是支持的。

Commonjs：require.ensure

```javascript
    require.ensure(['moduleA','moduleB'],function(require){
        var a = require('moduleA');
    })
```

AMD的话就是本身的require就是支持的。

ES6的模块的话，webpack1.x.x是没有原生支持的，2.0.0支持。所以只能通过babel将ES6的模块转化成Commonjs或者AMD的模块。这个方法有效果但是对于动态加载有一些警告。

模块语法import x from 'foo'是故意设计来静态分析的，这就意味着没法做动态的引用。

幸运的是，有一个js的api“loader”专门是写来处理动态使用的例子的。“System.load”。这个API将会native地等价于上面的require方法。但是，大多数编译器都没法处理这个变成require。所以如果我们想要动态的代码分割，我们就得直接来写。

### 代码块内容
所有的在分割点的依赖都会打进一个新的代码块中，递归的依赖也会被打进chunk中。

如果你在分割点传入一个callback，webpack也会自动将这个callback的所有依赖打进chunk。   

### 代码块优化
如果两个代码块包含同一个模块，他们会被和到一个里面，这会导致代码块拥有多个父辈。

如果一个模块在代码块的所有父辈中都可以访问到，他会被从代码块中移出。

如果一个代码块包含另一个代码块的所有模块，他会被存储。他实现了多重的代码块。

### 代码块加载
取决于配置项target，一个为了代码块加载的运行时的逻辑会被添加进bundle中。例如，web目标的代码块会被通过jsonp加载。一个代码块只被load一次，平行的请求会被合进一个里面。运行时会检测加载的代码块来看他们是否导致了多重的代码块。

### 代码块的种类
#### 入口代码块
入口代码块含有一个运行时加上一系列的模块。如果代码块包含模块0，运行时就会执行他。如果不包含，就等待包含了模块0的代码块，然后执行他。（每次包含模块0）

#### 一般模块
一般模块不包含运行时，他只包含了一些模块，他的结构取决于模块加载算法。比如，jsonp的模块就会包含在jsonp的回调中。这个代码块也包含他需要的一系列的代码块的id。

#### 初始模块
初始模块是一个一般模块，唯一的区别在于优化把他看的更重要，因为他意味着初始加载时间。代码块种类可以在CommonsChunkPlugin融合的过程中发生。

#### 分离代码和供应代码
把你的app分成2个文件，比如叫做app.js和vendor.js。然后把名字传给CommonsChunkPlugin这个插件。

这样子的话就会将所有的vendor中的模块从app中删去，这样，得到的bundle.js就会只含有你的app的code。不会包含他的依赖。当然引入的时候得先引入那个vendor包。

#### 多个入口代码块
可能需要配置多个入口点会导致多个入口代码块。入口代码块包含着运行态，并且每个单页面都只能包含一个运行态。

#### 运行多个入口点
由于CommonsChunkPlugin，运行时其实已经进入了commons的代码块中了。入口点现在在初始化代码块中。尽管只有一个初始代码块可以被加载，但是多个入口代码块可以被加载。这样在一个页面就可以有多个入口点了。

#### Commons代码块
CommonsChunkPlugin把依赖的代码移到了一个新的入口代码块，运行时也进了代码块。这意味着老的入口代码块现在是初始化代码块了。

#### 优化
有些优化的插件可以取决于一些特殊的标准来合并代码块。

#### 命名代码块
require.ensure方法接收一个增加的额外的第三个参数，如果两个分离点传同一个string，意味着他们使用同一个模块。

#### require.include
require.include是一个webpack的特性的函数。他能添加一个模块进当前的代码块中。但是不评估他。(申明会从bundle中删去)

当一个模块存在于多个子代码块的时候，require.include是挺好用的。在父代码块中，require.include将会包含这个模块，而子代码块中的模块实例将会消失。

## configuration
webpack其实是一个配置对象。取决于你的webpack的用法，有两种方式来传递这个配置对象。

### CLI与nodejs API
如果你使用CLI，他将会读一个文件webpack.config.js，或者通过--config传入的文件。这个文件将会导出配置对象。`module.exports`

如果你使用nodejs API，你需要传这个配置对象作为参数。webpack({//configuration},callback)

在两种case下，你都可以使用数组化的配置，并行执行。他们共享文件系统的缓存和观察者，所以这比多次调用webpack更加高效。

### 配置对象内容

    记住我们并不需要写纯净的JSON进配置中。使用任何你想要的JS，他只是一个nodejs的模块。

#### context
就是处理entry的基础目录，如果output.pathinfo被设置了，包含的pathinfo是对这个目录的缩写。

#### entry
bundle的入口文件，如果你传一个string，这个字符就会被解析为模块加载时启动。如果你传了一个数组，所有的模块会在启动时加载，最后一个被export。如果你传了一个对象，会有多个入口bundle，key是模块名。

#### output
影响编译输出的配置项。output告诉了webpack如何去写编译的文件到disk上。注意尽管有多个entry的点，只有一个output的配置。如果你使用了任何的散列来让模块一定有一个一致的排序，使用OccurenceOrderPlugin或者recordsPath。

 - output.filename：指定每个输出文件在磁盘上的名称，你不能在这里指定一个绝对路径
 - output.path：决定了文件被写入的磁盘的位置
 - output.filename：仅用于命名的文件名
 - output.publicPath：用于规定页面上的公共资源，比如js，css，img的路径，因为可能会需要放置到不同的domain或者CDN。
 - output.chunkFilename：无入口的chunk的name，相对于path
 - output.sourceMapFilename：js文件的sourcemap的文件名。default：[file].map

接下来还有一堆先不看了

如果你的配置创建了多于一个块你应该使用下面的替换，来保证每个文件有一个独一无二的名字。[name]会被chunk的name替换，[hash]会被编译的hash替换，[chunkhash]被chunk的hash替换

#### module
module.loaders：自动应用的加载器数组，每个item都有下面的属性：

 - test：必须满足的条件，正则
 - exclude：必须不满足的条件
 - include：必须满足的条件
 - loader：一个以`!`分隔的loaders
 - loaders：loader的字符串数组

 其他的内容先不管

#### resolve
影响了模块的解析

 - root：包含了你的模块的`绝对路径`，可能是一个array，这个用来添加独立的目录进搜索路径
 - modulesDirectories：这里传的是如何node去找到node_modules文件夹，如果我想要处理的话，感觉加个neurons，然后加个webpack的插件应该可以搞定。
 - fallback：一个文件夹，webpack将会去查找模块，当没法在root或者modulesDirectories里面寻找到的时候提供了一个fallback

#### externals (懂了)
指定依赖项不应该被webpack处理，但是应该成为bundle的依赖。依赖的种类取决于'output.libraryTarget'

    这个其实很简单，页面可能已经通过script的方式引入了某个类库，但是我们使用的时候并不想通过全局变量来引用，于是我们配置了externals以及那个类库的引入方法之后，就可以在代码里面进行require了。

#### bail（懂了）
这个是运行webpack的时候作为参数带着  --bail

    就是编译错误的时候会把报错信息显示的更加详细

#### profile （懂了）
这个是运行webpack的时候作为参数带着 --profile

    会把每个模块的时间信息打印出来

#### cache
缓存生成模块和chunk来提高多个增量构建的性能，在watch模式被默认开启，可以传false来阻止。

#### debug
切换loader到开发模式

#### devtool （懂了）
选择一个开发工具来改善debug，就是选一种sourcemap，其实很简单就能开启。

#### devServer（懂了）
其实就是热部署的一个配置项

## Loaders
loaders允许你预处理文件，你需要使用require或者load他们。Loaders就像是其他构建工具的tasks。提供了一个强大的方式来处理前端构建步骤。loaders能够转换不同的语言。loader甚至允许你进行css的require。

告知webpack进行loader的应用，你可以在config里面写好，或者在require的时候写明。

当链式调用loader的时候，顺序是从右向左的。

## loader order
在文件从文件系统读出来之后，loaders会以下面的顺序执行。

 - config里面的preloader
 - config里面的loaders
 - 在require里面申明的loaders
 - config里面的postloaders

我们在require里面可以通过添加前缀来取消一些loader的执行。比如`!``!!``-!`

## HOW TO WRITE A LOADER
一个loader就是一个export一个function的node模块。

这个方法会在资源需要被转化的时候被调用。

在这个简单的case中，当一个简单的loader被应用到资源上。这个loader被传入这个资源的文本作为一个string参数调用。

这个loader可以在函数中通过this这个参数得到loader api。

一个同步的loader只希望得到一个简单返回的string，在其他任意的case中，loader都返回任意数量的value通过this.callback。错误也是this.callback来返回或者通过一个同步的loader返回。

loader希望返回一到两个值，第一个值是js code作为string或者buffer。第二个可选的value是一个sourcemap作为js对象。

在复杂的case中，当多个loader被链式调用，只有最后的loader拿到资源文件，只有第一个loader希望返回一到两个值。

### Guidelines
#### do only a single task

loader可以被链式调用，为每一步创建loader，而不是一个loader一次性做所有的事情。这也意味着如果不是必要的话他们不该被转化为js。例子：通过应用查询参数来从模板里渲染html。可以写一个loader来从source中编译，执行他，然后返回一个包含了HTML code的字符串。我们应该在这种使用过程中为了每个task写loader并且管道应用他们。

 - jade-loader：将模板转化为一个抛出方法的模块
 - apply-loader：通过应用查询参数，返回结果
 - html-loader：接受html，返回一个字符串的export模块

#### generate modules that are modular
loader生成模块必须像是正常的模块一样期望同样的设计原则。

#### flag itself cacheable if possible
大多数loader都是可以被缓存的，所以他们需要flag他们自己成可缓存的，直接调用cacheable就行了。

### not keep state between runs and modules
loader应该独立于其他的模块编译。loader应该独立于同一个模块的前一次编译

### mark dependences
如果一个loader依赖了其他的资源，比如从文件系统中读取，他必须被通知到。这个信息用来缓存失效机制以及在watch模式下重新编译

就是调用addDependency这个方法

### resolve dependences
在许多语言中，有一些模式来指定依赖项，例如，在css中有@import和url。这些依赖应该由模块系统来处理，现在有两个选择：

 - 将他们都转化为require
 - 使用this.resolve来处理路径

## HOW TO ARITE A PLUGIN
插件向第三方开发者暴露了webpack引擎的的全部潜力。使用构建的回调，开发者可以在webpack的构建过程中引入他们自己的行为。构建插件比构建loader更加先进一些，因为你需要去理解一些webpack的底层的钩子。准备好去阅读一些源码。

### 编译器和编译过程
开发插件的过程中最重要的两个资源是compiler和compilation。理解他们的角色是扩展webpack引擎的重要的第一步。

 - compiler对象代表了完整的webpack的配置环境，这个对象在开始webpack的时候被构建一次，并且是被那些options，loaders和plugins所一起配置的。当对webpack环境应用一个插件的时候，这个插件将会接收到这个compiler的引用。使用这个compiler来访问主要的webpack环境。
 - compilation对象代表了版本资源的单次的build。当运行webpack开发中间件的时候，每次当一个文件改变的时候，一个新的compliation将会被创建，从而生成一组编译资源。一个compilation表面信息是关于模块资源的当前状态，编制资产，改变的文件以及查看依赖。compilation也提供了许多的callback点以供执行自定义操作。

### 基本的插件结构
插件是在原型链上拥有apply方法的实例对象。apply方法在webpack compiler安装这个插件的时候被执行一次。apply方法给予了底层webpack编译器的引用，提供了compiler callback的访问。

### 访问compilation
使用compiler对象，你可以绑定对每次compilation都提供了引用的回调。这些compilation提供了许多构建过程的步骤的回调。
