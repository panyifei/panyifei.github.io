---
layout: default
title: {{ site.name }}
---
# Redux文档阅读
Redux是js的一个可预测的状态的管理者。

# 介绍
## 要旨
 - 你的App的所有的状态存在一个单一store的对象树中。
 - 唯一的改变状态树的方法是发出一个action(一个对象描述发生了什么)
 - 通过写纯函数reducer来指定action是如何更改状态树的。

就这么多..

Redux没有一个dispather，并且不支持many stores。

他只拥有一个store和一个单一的reducer方法。

当项目不断演进的过程中，可以分割reducer成为更小的reducer来独立地操作状态树的不同部分。这点很像React app只对外一个根节点，但是它由很多小的部分组成的。

## 动机
随着单页应用的需求变得越来越复杂，我们的代码比起以前而言需要管理更多的状态。这下状态包括服务器的返回，缓存的数据，还有本地的一些数据。UI的状态也变得越来越复杂。

管理这个不断改变的状态是困难的，当我们失去了state的控制之后，我们基本也不懂程序发生了什么了。当一个程序是不透明的和不确定的，很难重现bug或者添加新特性。

问题变得难处理是因为我们把两个人脑很难区分的概念混在了一起，就是异变和异步。

Redux尝试着来让状态突变变得可预测。

## 3个原则
React可以用3个基本原则描述

### 单一来源的真理
你的整个app的状态存在一个单一store的对象树中。

这使得能够创建通用的app，你服务器的状态可以通过序列化传递给客户端，并且没有额外的代码。一个简单的状态树使得调试和反省整个项目变得容易，

### 状态是只读的
唯一的改变状态树的方法是发出一个action(一个对象描述发生了什么)

这点保证了无论是view还是网络的回调都不可能直接修改state。相替代的，他们表示了一个去转换state的意图，因为所有的改变都是按照一个严格顺序一步步执行的，他就没有一个竞态的顺序需要去注意。行动是简单的对象，他们是很容易被统计，存储，以及序列化的。

### 改变是通过纯函数执行的。
通过写纯函数reducer来指定action是如何更改状态树的。

recuder是纯函数，输入原来的状态和action，得到了新的状态。记住我们是返回新的状态对象，而不是在原来的state上进行改变。我们可以从一个单一的reducer开始，然后随着app grow，将它细分成更小的reducer。因为reducer仅仅只是函数，我们可以控制他们执行的顺序，传入外地的数据，甚至在分页这种普遍的任务中使用可重用的reducer。

## 现有技术
Redux是一个混合的遗产。他和一些模式和技术很像，但是也在一些重要的部分与他们是不同的。

### Flux
Redux可以被以为是一个Flux的实现吗？是也不是。Flux的创造者承认了这点。

Redux的灵感来源于Flux的几个重要特性。像Flux一样，Redux让你把model的更新逻辑放到了你的app的一个层去解决。(在Flux中为stores，在Redux中为reducers)。都让你通过一个叫做action的空对象来描述每次突变。

与Flux不同的是，Redux没有一个dispatcher的概念。这是因为他依赖于纯函数，而不是事件发射器。纯函数很容易管理，不需要一个额外的实体来管理他。你可以把它当做一个偏差或者一个实现细节。从(state,action) => state这个方面来看，Redux确实是Flux的架构，但是由于是纯函数，这个就更简单了。

另一个重要的区别是Redux假设你从不突变你的数据。就是说在reducer里面修改这个数据是很不被推荐的，我们应该返回新的数据，类似于Immutable。

我们从技术上是可以写非纯函数来变异数据的，但是我们劝你不要这么做。

### Elm
这是一门语言，被Haskell影响的。他的更新机制updater很像Redux的reducer。他最后会被编译为js。因为他是语言，所以我们可以强制他纯函数。

### Immutable
Immutable是一个js库，实现持久化数据结构。他有比较惯用的js api。

Redux不关心你如何存储一个对象，可以是个简单的对象，可以是个Immutable对象。

### Baobab
另一个为更新简单的JS对象实现了immutable api的库。与Redux一起用的好处不大。因为他的更新是给数据提供了游标修改的，而Redux希望的是只在dispatch一个action来修改数据。

### Rx
只能说他能配合RX做一些事情，毕竟RX是流式管理事件流顺序的，可以用RX管理多个异步事件流，然后再把他们交给store.dispatch。

## 生态系统
Redux是个小的库，但是他的概念和API都是很精心挑选来扩展成工具和扩展的生态系统。

# 基础
## actions
actions是从应用向store发送的信息。他们是store的唯一的信息来源，我们使用store.dispatch来发送信息。

action是简单的js对象，action必须有个type的属性来指示需要被执行的action。type必须被定义为string的类型，一旦app大了之后，我们可能需要把他们移到独立的模块。

除了type之外，action的结构随我们定义，这里也有个小规范啦。

这里引入了一个action creator的概念，不过没啥意思，小语法糖。

## reducers
action描述了到底发生了什么，但是没有指明应用的state作为结果是如何改变的，这是reducer的任务。

在redux中，所有的应用state都是存为了一个单一对象，在写代码之前去思考下他的形状很重要，如何把你的应用的状态最小展示为一个对象。

reducer是个纯函数，只拿取老的状态，action，然后返回一个新的状态。我们在reducer里面并不能干的事情：

 - 突变参数
 - 做一些边界影响，例如调用API，或者路由转换
 - 执行一些不纯洁的方法，例如random或者Date.now这种

在下面会有介绍边界影响的地方，目前记好了reducer必须是纯的。如果是flux的话，会有个dispatcher，会有个事件发射器。redux的话用出纯函数的reducer来取代了事件发射器。

## store
store是个将action和reducer结合到一起的地方，他有以下的任务：

 - 保存应用的state
 - 允许通过getState来拿到数据
 - 允许数据可以通过dispatch来更新
 - 通过subscribe注册监听
 - 通过subscribe返回的函数来取消注册监听

注意很重要的是你只有一个单一store，当你想要分割数据处理逻辑，你可以使用reducer composition而不是很多个store。

创建store很容易，在之前的模块，使用combineReducer来combine多个reducer成为一个，现在将他传给createStore就好了。

我们可以将createStore的第二个参数来指定初始状态。

## 数据流
redux的结构是严格的单向数据流。意味着应用中的数据都是遵循着同样的生命周期模式，让你的app更加可预测并且可理解。也鼓励了数据一致化。

## 与react的使用方法
他能很好的和react合作的原因是，react把state作为了UI的一种描述形式。

# 进阶
## 异步action
在之前的介绍中，我们创建的完全是同步的应用，每次一个action发出的时候，state都会立刻更新。现在开始介绍如果异步的请求来适应redux流。

主要的思想就是action除了返回对象之外还可以返回函数，这个时候action创建函数就变成了thunk了。

然后这时接入redux-thunk，这个中间件就会在action返回函数的时候执行。这个函数可以是不纯净的，可以去执行异步函数，也可以dispatch action。当然了，thunk并不是唯一方式，redux-saga使用感觉很不错啊。

## 异步数据流
默认情况下，createStore的Redux store没有用到middware，只支持同步数据流。

其实中间件的中间环节随便我们返回什么，但是到了最后只要返回一个简单的action对象就好了，saga估计也就是在这里面做了很多文章。

## 中间件
用过express或者koa的话，就会有一个已经熟悉的中间件的概念了。与之类似的，redux提供了一个第三方的点，就是从发出一个action到他到达reducer的时候。本文就是带我们了解moddleware。

就是从打log这一件事上，慢慢地去寻找到底补丁该打在哪里咯。

## 与React Router一起使用
react-router原来保留#的原因是为了适配IE9，params是react-router提供的功能啊。

# 技巧
## 转换到redux
redux并不是一个单一框架，是一系列的约定以及一些让他们一起运行的函数。

## 使用对象展开运行符
我们平常时候写Object.assign来复制一个新的对象，但是代码很冗余啊，于是我们用对象展开运算符，可以将对象的可枚举属性拷贝至另一个对象。

## 减少样板代码
## 服务器端渲染
## 计算衍生字段
Reselect库可以创建可记忆的，可组合的selector函数，可以用来高效的计算衍生数据。

这个挺有意思的，之前react的渲染可以使用shuoldComponentUpdate来判断是否重新渲染，如果不需要的话直接不渲染就好了。虽然可以不过粒度太大了。因为connet到store的时候会从真实的数据计算成衍生数据，也就是selector了，这个东西每次props改变的时候都会计算，如果计算量很大的话，很尴尬的。

于是用了这个库，他会比较传入的参数是否绝对相等，不过变化了就重新计算，如果没变化就不计算了，他的很大的一个好处是他可以将粒度拆的很细。

## 实现撤销重做
实现撤销操作在传统听难做的，你可能得克隆所有的model状态来追踪历史状态，

撤销重做的数据结构其实不难诶：

 - past:[1,2,3]
 - present:4
 - future:[5,6]

重做就是从future的头部推入present，present推入past，撤销就是past的尾部推入present，present推入future，当位于撤销的时候，新建了事件，就抛弃future。

实现的话用高等函数做？！好吧，其实就是接受了一个reducer，然后这个reducer被包装了下，返回了一个reducer，不过这个reducer认识UMDO和REDO。跟combineReducer其实做的是一样的事情，已经有redux-undo来做这件事情了。

## 子应用隔离
子应用的意思就是应用之间完全独立，相互之间不会共享数据或者action，不可见，不互相通信。

于是就完全当做几个app做，就是createStore，Provider封装在组件内，多次调用组件创建完全隔离的store。

## 构建reducer
这是redux的核心，redux是个很简单的设计模式。所有写的逻辑都进入了一个简单对象，运行的唯一方法就是传一个简单对象描述如何发生。redux store调用这段逻辑传入当前状态树和描述对象，这段写的逻辑返回新的状态树。Redux通知监听者，这颗状态树已经被更新了。

redux要求了reducer的格式，而且要求是纯函数，并且是可预测的。他只要你遵守他的限制，并不在乎你如何构建你的逻辑。既是自由之源，也是混乱之源。但是，还是有很多通用的模式。

## 必要的Reducer思想
注意必须生成一个新对象，不仅仅是最外层的对象，对于任何子对象都得做到。

突变不被推荐的原因是他通常打破了时差调试，还有redux的connect方法：意思是React的devtools会希望重新执行来得到一个值而不会产生影响。connet函数检查脏也就是检查引用是否改变了，如果没有改变的话那就不会重新渲染了。

其实是有数据库设计的问题的感觉。

## 基本的reducer结构
注意，整个app只有一个reducer，他是传入createStore的第一个参数。这个reducer需要做的事情有，第一次state为undefined的时候，reducer需要提供一个默认的state。在拿到action之后，对老的state进行处理得到新的数据后，返回一个新的对象。如果没有变化，返回老的数据。

这里就是说data大部分也就是3种分类，包含了数据的Domain Data，应用的状态App Data(就是比如现在正在获取数据？那个目前被选中着)，还有就是界面状态UI Data(比如modal现在打开着)。

## 拆分reducer逻辑
对于有意义的应用来说，将你的所有的更新逻辑放到一个reducer方法会很快变得不可维护。函数应该尽可能短，在理想状态下应该只做一件事。因此，将代码拆成一块块的是个好的编程习惯。

因为reducer也就是一个function，我们可以将reducer逻辑拆成多个方法，然后从敷方法调用新方法。

其实就只有combineReducers这个语法糖而已。

## 重构reducer的例子
这里的拆的整体的过程好有意思，反正最后要返回的是一个新对象，就对每个属性做单独的reducer，例如：

```javascript
function rootReducer(state = initialState, action){
  return {
    tudos: todosReducer(state.todos, action),
    visibilityFilter: visibilityFilterReducer(state.visibilityFilter, action),
  };
}
```

然后用一个高阶函数把switch去掉了，就会直接根据property匹配相应的函数了，也很神奇啊。高阶函数可以做好多事情，他可以对于一个函数进行自定义化。

然后上面的那坨代码可以使用内置的combineReducers来复写：

```javascript
const appReducer = combineReducers({
    visibilityFilter : visibilityReducer,
    todos : todosReducer
});
```

太开心了，太帅气了！终于搞清楚里面是啥了。

## 使用combineReducers
多个reducer响应同一个action，独立更新自己的部分，然后所有的部分被合成一个新的state对象。

因为这个模式很常见，redux提供了combineReducers来实现这个行为，他是一个更高级的reducer，拿那些部分reducer来生成一个新的reducer。

几个重要的点：

 - 首先，combineReducers是一个简化大多数情况下的功能，不一定需要，很有可能用不到也有可能不适用。
 - Redux本身不对你state的管理做限制，combineReducers强制执行几个规则。
 - Redux是否在发起一个action的时候调用了所有的Reducer？因为只有一个root reducer方法，所以答案是不调用，但是combineReudcer为了得到新的state树，会用当前的action和state再生成一次，给这些部分一个改变的机会，所以combineReducer执行了所有的
 - 我们可以在reducer的所有层级使用它，而不仅仅是根层次，很常用的，我们会有大量的combined reducer。

### 定义状态
两种方法来定义你store的state的初始形状和内容。首先，createStore会用preloadedState作为首参数，这主要是为了用之前在浏览器中初始化的状态，例如浏览器的localStorage。另一种方法是让root reducer在state为undefined的时候返回初始值。但是当用combineReducers的时候有些额外的关注点我们需要去看。

看意思就是我们如果不传入初始值，就会以reducer的名字为state的初始值，我们在用combineReducer的时候最好带上名字。

## beyond combineReducers
redux的combineReducers很有用，我们故意限制来处理一个简单的case：通过委托更新每一部分的state给特定的slice reducer来更新一个树(一个简单的js对象)。他不处理其他的case，例如一颗用Immutable的maps做的树，尝试传入部分state树作为额外的参数；或者slice reducer的排序；他也不关心如何slice reducer如何运行。

通常的问题是，我如何使用combineReducer来处理这些其他的使用。答案很简单，你可能要用些其他东西了。一旦你超越了核心使用case，就得用更自定义的reducer逻辑了，无论是一次性的用例，还是可以被广泛复用的功能。下面是处理这几种典型用例的建议，不过你自己使用的使用free一些。

## beyond combineReducers
redux的combineReducers很有用，我们故意限制来处理一个简单的case：通过委托更新每一部分的state给特定的slice reducer来更新一个树(一个简单的js对象)。他不处理其他的case，例如一颗用Immutable的maps做的树，尝试传入部分state树作为额外的参数；或者slice reducer的排序；他也不关心如何slice reducer如何运行。

通常的问题是，我如何使用combineReducer来处理这些其他的使用。答案很简单，你可能要用些其他东西了。一旦你超越了核心使用case，就得用更自定义的reducer逻辑了，无论是一次性的用例，还是可以被广泛复用的功能。下面是处理这几种典型用例的建议，不过你自己使用的使用free一些。

### 在slice reducer里用Immutable对象
目前combineReducer只能用空白的js对象。用immutable对象作为state的应用没法使用combineRuducer来管理map。因为许多开发者使用immutable，有一些已经发布的程序提供了等效的功能的，例如redux-immutable。这个package提供了自己实现的combineReducer知道如何迭代不可变的map而不是纯java对象。

### 在slice reducer之间分享数据
类似的，如果sliceA碰巧需要sliceB的部分数据，或者sliceB碰巧需要整个state作为参数，combineReducer并不自己处理这个。这可以通过写一个自定义的知道传入需要的数据作为额外的参数的函数来解决。

一种方法是重新处理下combineReducer，在某些action的时候时候多传些数据，然后在action接住的时候拿数据。

另一种是用高阶函数包一下创建action的函数，多穿些参数。

第三种是用一个combineReducer来处理最简单的情况，然后用一个reducer来处理特殊的需要相互之间交流数据的情况。然后一个包裹的方法，可以来同步运行过这两个reducer。

类似于一个叫做reduce-reducers的模块，他接收大量的reducer然后运行reduce，把之前的结果传给后面的reducer。

如果使用reduceReducers，我们要保证第一个处理了默认情况，因为后面的都会默认整个state已存在。

### 更多建议
理解redux reducer仅仅只是方法很重要。combineReducer很有用，但他只是一个工具。函数可以包含逻辑语句，可以包裹函数可以调用其他函数。你可能需要你的某个slice reducer来重置他的状态，并且只响应特殊的action，你可以用一些特殊的api，上面都提到过的。也就是我们可以有很大的选择权，我们也可以写自己的函数。

## Normalizing State Shape
许多应用处理自然嵌套或者相关的数据。比如，博客主有很多博客，每个博客有评论，所有的博客和评论都是由用户编写。

我们的数据结构可能会很庞大，并且有大量冗余。

 - 当一部分数据在多个地方复制的时候，同步的更新变得很难了。
 - 嵌套数据意味着相应的reducer的逻辑也变得嵌套而且复杂，特别是，尝试更新一个深入嵌套的字段会很难看
 - 因为immutable数据会要求他所有的祖先都被复制且被更新，一个新的对象引用会导致所有连接的UI重新渲染，

 由于这个原因，推荐的方法是在redux中处理关系数据或嵌套数据的时候把他处理为数据库，并将其保存为规范化形式。

 ### 规范化设计state
 基本概念是：

  - 每种类型的数据在state中有自己的表
  - 每个数据表应该将各个项目存在对象中，然后ID作为key，item本身作为值
  - 任何对于项目的引用都应该通过存ID来实现
  - 应该有个数组的IDs用来指示排序


然后给了个例子，给的状态结构总体上更加平坦，与原来的嵌套相比，下面几个方面有改进：

 - 因为item只定义在了一个地方，我们不需要在更新的时候改变多个地方了
 - reducer逻辑不用处理多层嵌套，所以看上去会简单
 - 检索和更新变得简单，我们不再需要深挖state，我们很容易就可以追踪了
 - 因为平层了，所以通常UI通常改动会更少了，我们不需要更新更深层的数据了

规范化的结构通常意味着更多的连接，而不是父组件连接所有向下传递。父元素简单的将ID向下传更容易做性能的优化，渲染上。所以结构化state是改善性能的好方法。

### 组织结构化的state
一个传统的应用会有关系数据和非关系数据的混合，并没有原则来确定描述如何处理，一个常用的模式是将关系的tables放在一个通用的父key下面，例如entities。

### Relationships and Tables
因为我们把我们redux的store当成是数据库了，所以数据库设计的很多原则我们可以使用上来，例如多对多的关系，我们可以存储一个中间表来存对应关系（通常叫做关联表或者连接表），为了保持一致性，我们会都是用byId和allIds来管理。数据库操作的性能也会比较好。

### Normalizing Nested Data
因为API返回的数据很多都是嵌套的，我们可能需要格式化之后再存入state中，Normalizr库就是干的这个事情，可以抽空看下Normalizr库是怎么写的~~
