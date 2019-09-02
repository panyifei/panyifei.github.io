---
layout: default
title: React文档阅读
---
## quick start

### Tutorial

#### 建立一个模块

我们可以使用 React.createClass()来创建一个 React 模块。我们通过一个 JS 对象传了一些方法给这个函数，最重要的方法是 render，返回了最终会变成 HTML 的部分。

render 里面的 div 不是真正的 DOM 节点，他们是 React 的 div components 的实例化，不直接产生 HTML，所以 XSS 保护是默认的。

我们使用 ReactDom.render()来实例化入口框架，这个方法必须在最下面模块定义好了才执行，这个方法来真正的产生 DOM，其他的平台的话有其他的生成方式，比如 React Native。

HTML tags 在生成的时候会调用 React.createElement(tagName)来创建。

#### this.props

由父模块传递给子模块的数据，我们可以在子模块中通过 this.props 来访问得到。

#### dangerouslySetInnerHTML

如果我们想要直接插入 html 进入文档中(这一点需要自己来保证 XSS 的问题)，我们可以使用 dangerouslySetInnerHTML 这个属性来添加。

#### 遍历输出

```javascript
var commentListNodes = this.props.comList.map(function(comment) {
  return (
    <Comment author={comment.author} key={comment.id}>
      {comment.text}
    </Comment>
  );
});
```

我们可以通过 map 方法来得到数组，然后使用的时候直接{commentListNodes}就能输出了。

#### state

目前，依赖于 props，所有的组件都是被刷新了一次，props 是不变的，这个被父组件传过来的且被父组件拥有。所以出现了 state 这个属性，我们使用这个可变的私有的值来改变状态。我们可以使用 setState()来 rerender 这个组件。getInitialState 这个方法会在初始化的时候执行一次来初始化组件的初始状态。

#### componentDidMount

这个方法会在组件第一次初始化之后被调用

#### 控制组件的输入

这里推荐的也是在 this.state 里面存这个 value，在 input 的 onChange 时调用修改 this.setState 来改变。包括 submit 方法的话就是监听 onSubmit。我们可以先调用 e.preventDefault()来阻止默认行为。

#### 从子组件传数据给父组件

我们可以在调用子组件的时候，将 callback 绑在 props 上，然后调用子组件的 props 上面的方法来调用父组件相应的方法。

#### 我们在写一些回调的时候要绑定好 this

```javascript
$.ajax({
  url: this.props.url,
  dataType: "json",
  type: "POST",
  data: comment,
  success: function(data) {
    this.setState({ data: data });
  }.bind(this)
});
//就像这样绑定好this
```

#### Tip

这里还给了一个小建议，我们在添加了某一项之后，可以直接加进 list，如果 ajax 失败了再重置回去

### Thinking in React

#### 创建 react 的步骤

我们分解成 react 要尊崇单一职责原则，尽量把交互与展示分开，展示也根据种类分细点

然后我们先不考虑交互，不考虑传输的数据，先创建一个静态的项目出来

react 是单项绑定的

然后我们要计算出最小的 state 我们需要什么，通过父组件传的，不变的，能够通过其他 state 计算得到的都不应该是 state

我们需要得出哪一块需要数据，如果我们实在没法区分的时候，我们可以专门在其上用一个组件来专门管理 state

## 社区资源

这个就先不看了

## Guides

### why react

React 就像是 MVC 的 view 层，react 主要解决的是大项目数据不断变化的场景。我们只需要修改数据，react 会帮我们进行所有的 UI 更新。

他只更新被改变的部分。

### Displaying Data

他的组件是很封闭的，所以更容易重用，更容易测试以及分离相关。

Components 更像是方法，接受 props 和 state 来生成 HTML。(react 模块只能生成一个简单的根节点，如果想要返回大量的节点的话，得用一个根节点包裹起来)

React 允许我们用 js 对象的形式来创建 HTML，如`React.createElement('a',{href:''},'Hello!')。为了简便，我们还可以使用 createFactory 的形式来创建。但是使用比较少，还是 JSX 比较方便。

JSX 时间上只是一种语法，并不是使用 React 的必需品，不用的话，就得像上面一样使用 create 的形式慢慢创建。

### Jsx in Depth

我们在 JSX 里面使用 HTML tag 的时候，用小写的形式。如果是 HTML 属性的话，使用驼峰的写法。并且因为 class 和 for 都作为 XML 的本身的属性名，所以我们分别用 className 和 htmlFor 来代替。

我们在版本 0.11 以上可以使用 namespaced components，就是在某个组件之下进行申明。

当我们在属性里想要使用 js 的表达式的时候，用一个大括号包裹起来，替代双引号。

boolean attribute，如 disable，readonly，checked，required 直接省略属性值和{true}一样，如果不写和值为{false}效果一样。

js 表达式也可以用来申明生成哪个子节点，比如{ifShow ? <Nav/> : <Login/>}。

注释的话使用这种形式是可以的{/\* \*/}。

### Jsx 延展属性

我们可以使用延展属性，来讲一个对象所有的属性复制到另一个对象上。我们可以多次使用，或者和普通的属性一起用，不过得注意顺序，后面的会覆盖前面的。这里是 React 直接支持。

```javascript
var props = { foo: "check" };
var component = <Component {...props} foo="name" />;
console.log(component.props.foo);
//name
```

延展属性在 ES6 的效果主要是将数组类型的一个个推出来，就像是 apply 方法一样，支持情况当然不好啦，但是 Bebal 可以转。

### JSX 一些陷阱

如果想插入&middot;这种符号的话，我们可以直接插入，但是如果想插入动态的话，我们就会以这样的形式包装起来{'&middot;'}，然后就没法显示了

我们可以直接以 UTF-8 的形式写个点，或者我们可以写 unicode 的编码\u00b7，或者我们用个 span 包起来，例如`{['First ', <span>&middot;</span>, ' Second']}`，或者我们可以直接 dangerouslySetInnerHTML=\{#\{\_\_html: 'First &middot; Second'\}#\}这样来强行插入原始的 HTML。

原生的 HTML 的自定义属性必须以 data 开头，自定义的节点的属性可以是任意的，aria-hidden 这种 aria-开头的属性是可以正常 render 的。

### 交互以及动态 UI

他自动把方法绑定在模块上，是使用的事件代理，完全绑在了根元素上。

模块就是状态机。

通过 setState 来将 data merge 进入 this.state 中，这里的 merge 只有一层，如果想深层次的 merge，使用那个`immutability helpers`

所以我们应该有许多 stateless 的模块来负责渲染，然后在其上有一个 stateful 的模块来将 state 通过 props 传给这个模块。

计算过的数据，react 模块以及与 props 里面重复的数据都不应该在 State 里面出现。

### Multiple Components

动机主要是将关注点分离。

组件自己没法修改 props，这样可以保证组件是始终如一的。Owner 负责修改以及传递状态。

注意 Owner 和 Parent 是不一样的，`<Parent><Child/></Parent>`这个是 parent，而 owner 是 React.createClass。我们可以在 Parent 里面使用 this.props.children 来操作。

我们最好不要用 hide 来隐藏，我们应该直接让他们消失，对于 list 生成的我们需要给每一个一个唯一的 key 来保证他们正常且不别破坏。

数据流是单向绑定的。

JS 执行的速度是非常快的，所以基本上没有性能瓶颈。主要的瓶颈是 DOM 的渲染，而这点 React 帮我们通过批处理以及脏检测来优化过了。

当我们真的感觉到性能问题的时候，我们可以重写 shouldComponentUpdate 来让他返回 false 就可以了，但是其实不是很需要。

### Reusable Components

设计接口的时候，将那些简单设计的元素分解为可重复使用的，良好设计的接口。下次就可以复用了。

为了保证我们的组件被正确的使用，我们可以通过设置 propTypes 来限制用户传入的数据，但是这个东西只有在`development模式`才会有效。

#### default prop values

我们可以在用户没有传的时候设置一个默认值，调用 getDefaultProps 就可以设置默认值了，如果用户设置过的话，就会被忽略

#### Transferring Props: A Shortcut

有的时候我们想要从父元素传递 props 给子元素，我们可以直接使用 spread syntax 来简写，比如直接{...this.props}这样。

#### Mixins

当不同的组件拥有相同的功能的时候，我们可以使用 mixins，这个就是将组件的功能进行抽离的一个方法，还蛮有意思的。使用的时候加个`mixins: [SetIntervalMixin]`就可以了。

一个很重要的有点在于，如果有多个 Mixin 在同一个生命周期的方法执行，那么他们都会被执行，并且会严格按照申明的顺序执行。

#### ES6 Classes

我们也可以使用 es6 的 class 语法来声明组件，唯一不同的是没有 getInitialState 这个方法，我们只能在 constructor 里面手动初始化 state。

而且方法如果想要在 render 里面以 this 来调用的话，必须在 constructor 里面 bind 一下 this。

还有 propTypes 和 defaultProps 得在外面申明，而不是写在里面。下面的例子

```javascript
export class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialCount };
    this.tick = this.tick.bind(this);
  }
  tick() {
    this.setState({ count: this.state.count + 1 });
  }
  render() {
    return <div onClick={this.tick}>Clicks: {this.state.count}</div>;
  }
}
Counter.propTypes = { initialCount: React.PropTypes.number };
Counter.defaultProps = { initialCount: 0 };
```

关于 this 的绑定，我们可以在调用的时候绑定，也可以使用箭头，不过最好像上面一样在 constructor 里面绑定，这样只绑定了一次。

```javascript
<div onClick={this.tick.bind(this)}>//bad
<div onClick={()=> this.tick()}>//bad
```

ES6 的语法的话没有 Mixins 的支持。

#### Stateless Functions

如果组件只是一个简单的 js function 的话，我们可以使用这种语法

```javascript
function HelloMessage(props) {
  return <div>Hello {props.name}</div>;
}
//或者直接使用下面的箭头语法
const HelloMessage = props => <div>Hello {props.name}</div>;
```

这种比较适合没有 lifestyle 方法的，不存有内部状态，我们仍然可以设置 propTypes 和 defaultProps。就像 ES6 的设置一样。我们的项目应该较多的是 stateless 的模块。

### Transferring Props

我们想要传递给子模块的时候加上某个属性的话，可以直接使用 spread 语法。`<Component {...this.props} more="values" />`

如果没有用 jsx 的话，我们可以使用 ES6 的语法 Object.assign 和 underscore 的 extends。

如果我们在某一层组件的时候截断某个属性，然后将其他属性传下去的话，可以使用 other 的语法。

```javascript
function FancyCheckbox(props) {
  var { checked, ...other } = props;
  var fancyClass = checked ? "FancyChecked" : "FancyUnchecked";
  // `other` contains { onClick: console.log } but not the checked property
  return <div {...other} className={fancyClass} />;
}
ReactDOM.render(
  <FancyCheckbox checked={true} onClick={console.log.bind(console)}>
    Hello world!
  </FancyCheckbox>,
  document.getElementById("example")
);
```

这样子的话，other 就会只包含除了 checked 以外的属性了，主要是因为`checked`这个属性在 html 的结构有特殊的意义，而在自定义的组件没有这个效果。

我们也可以使用 rest properties，`var { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };`，不过在 webpack 里面得加上 transform-object-rest-spread 这个 plugin。

不用 jsx 的话，我们可以使用 underscore 的 omit 来删属性和 extends 来扩展。

### Forms

与 HTML 对应的，value 是被 input 和 textarea 支持的。

checked 是被 input 的 checkbox 和 radio 支持的。

selected 是被 options 支持的。

注意 HTML 中，textarea 的值是被设置在两个标签之间，REACT 是在 value 属性上。

onChange 事件会在 input 和 textarea 的值发生改变的时候触发，还有 input 的 checked 改变，以及 option 的 selected 改变的时候。

如果我们在 render 方法里面写死了 input 的 value，那么我们输入会被忽视的，只有 value 改为 state 的可变的值才行。

我们可以使用 defaultValue 给 input，textarea，select(这个支持 multiple)，然后 radio 和 checkbox 的值是 defaultChecked，注意这个值只能够在初始化的时候。

### Working with the browser

react 快的原因是因为他不直接与 DOM 交流，render 方法返回的对 DOM 的描述，react 会计算最快的更新页面的方法。

事件系统完美处理。

当我们想要调用 html 本身的命令的时候或者接触真实的 DOM 树，我们可以使用 refs 来控制。

#### Component Lifecycle

模块有 3 个主要的阶段：

- Mounting：组件准备插入 DOM 中
- Updating：组件更新
- Unmounting：组件从 DOM 中删除

Mounting 提供了 getInitialState()和 componentWillMount()和 componentDidMount()。

Updating 提供了 componentWillReceiveProps(这个方法的价值在于组件接收到新的 props 的时候，我们可以比较新老的 props，然后 setState。这个方法在初次 mount 的时候并不会被触发，因为这个时候没有老的 props)，shouldComponentUpdate，componentWillUpdate(组件即将执行更新之前，我们无法执行 setState 方法)，componentDidUpdate(更新发生之后会立即触发)。

Unmounting 提供了 componentWillUnmount()在组件被移除之前触发。

Mounted 好了的复合组件也提供了 component.forceUpdate()来强行重新刷一次。

react 支持 IE9 以及以上，但是我们可以引入 es5-shim 和 es5-sham 来让老版的支持，这其实取决于我们自己。

### Refs to Components

构建组件完了，你可能想要在 render 的 component 实例上调用方法。大多数情况下应该是用不到的，因为正常的数据流应该是父组件传 props 给子组件的。

jsx 并不返回一个 component 的实例，他只是返回一个 ReactElement（这只是一个告诉 React 这个组件应该是什么样子的轻量的）。

我们想要调用某个组价实例的方法，只能在最上层的 component 使用(就是 ReactDom.render 生成的东西)。在组件的内部，我们应该自己处理他们之间的状态，或者使用另一种方法来得到 ref(字符串属性或者回调方法属性)。

#### The ref Callback Attribute

ref 属性我们可以直接写成一个回调方法。这个方法会在组件结束 mount 之后立即被触发，参数是引用的组件。我们可以直接使用这个组件或着把他存了等到以后使用。

这个方法会在 componentDidMount 之前触发。

```javascript
render: function() {
    return (
      <TextInput
        ref={function(input) {
          if (input != null) {
            input.focus();
          }
        \}#\} />
    );
  },
render: function() {
  return <TextInput ref={(c) => this._input = c} />;
},
componentDidMount: function() {
  this._input.focus();
},
```

当我们将 refs 添加给 div 的时候，我们得到的是 DOM 元素，如果给自定义的组件绑定，我们得到的是 react 的实例。如果是我们自定义的组件，我们可以调用任何在他的 class 里面定义的方法。

当组件 unmounted 或者 ref 改变的时候，老的 ref 都会以 null 来被调用，所以说当 ref update 的时候，在被组件实例为参数之前，会立即调用一次 null 为参数的。(这点需要注意的)

#### The ref String Attribute

我们也可以简单的加一个 string 的 ref 属性，然后我们在其他的事件处理里面就可以 this.refs.xx 来调用了。

### Tooling Integration

作者希望 react 成为环境无关的，推荐了一些工具来让我们更好地使用各种种类的语言。

#### Language Tooling

我们写成 JSX 的文件的话，我们要用 babel 先转化为纯粹的 react 的语法。Flow 和 TypeScrip 也都支持 JSX 了。

#### Package Management

我们可以在 commonjs 系统 browserify 或者 webpack 里面直接 npm 的形式来引入 react 和 react-dom。

#### Server-side Environments

react 并不是真的依赖于 DOM，所以可以后端来执行，将 HTML 吐在页面上，如果是 nodejs 的话，是可以 ReactDOMServer.rendertoString 的。

如果是 java 的话，可以依赖于 Nashorn 这个 JS 的执行器来转化 JSX。

### Add-ons

这是一些 react 提供的功能插件，这些相对于核心来说变化的会比较多一些。以下的是一些实验性质的：

- TransitionGroup and CSSTransitionGroup：解决那些不容易实现的动画，例如在组件移除的时候的动画。
- LinkedStateMixin：这个是将 form 的属性与 state 绑在一起的插件，如果 form 比较大的话，这个还是很关键的。
- ...还有很多下面会慢慢介绍的

### Animation

react 提供了 ReactTransitionGroup 这种比较级别比较低的 api 来让我们使用，还提供了 ReactCSSTransitionGroup 来让我们更好的使用 css 实现的动画。包括进入和离开页面的动画。

当我们在 list 添加的时候，我们可以使用 ReactCSSTransitionGroup 的 enter 和 leave 来实现。他会根据 key 的区别来判断是不是新添加的，然后就会像我们通常触发动画一样来 toggle css 的 class。

组件初始化渲染的话，我们可以使用 transitionAppear 这个来添加动画。注意初始化渲染的时候，所有的 children 是 appear，然后后来添加进的就是 enter 了。

使用 ReactCSSTransitionGroup 我们得不到动画结束的通知，也无法为了动画加上更复杂的逻辑，想定制化，就得使用 ReactTransitionGroup 了。

如果想禁掉某些动画，我们可以设置为 false。

#### ReactTransitionGroup

这个玩意功能强大的多，他提供了在动画生命周期里能够执行的方法。使用到的时候再思考吧。

### Two-Way Binding Helpers

ReactLink 是个方便的在 react 里面实现双向绑定的工具。但是这个在新版本被废弃了，还是推荐通过 onchange 来设置值。

双向绑定实际上强制性的要求了 DOM 完全等于 react 的 state，这点虽然其实有很广的范围，React 提供了 ReactLink 来帮我们简单的封装了 setState 和 onChange 方法。他并没有实际上改变 react 的单项数据流。最好别用~

### Test Utilities

React 提供了非常棒的测试语法。配合 Jest 这层依赖于 Jsdom 的，我们可以写脚本测试整个的渲染以及事件逻辑。

我们可以直接写脚本模拟点击，模拟输入，模拟键盘事件。

类似于 ReactTestUtils.Simulate.click(node);

我们可以 renderIntoDocument 然后进行各种类型判断以及事件触发检验。

不依赖于 Jest，不依赖于 DOM，我们也可以 render 组件，使用如下的 Shallow rendering。

#### Shallow rendering

使用这个组件我们可以脱离 DOM 来渲染组件，但是这只是一层渲染，子组件不会被渲染。我们只能够检查 output 的信息。功能其实还是很少的。refs 也不支持，function 也不支持。

### Cloning ReactElements

cloneWithProps 这个组件被废弃了，现在只建议使用 React.cloneElement。就是在想要复制一个 element。并且在他的原 props 上进行一些修改。

### Keyed Fragments

有时我们需要将两块元素换位置，按照我们一般的写法，我们会单纯的给他们换位置，于是这些元素就会经历 unmount 和 remount 两个步骤。这是因为我们没有给他们每个模块一个单独的 key。我们如果使用 createFragment 就可以让元素不执行 unmount 了。

### Immutability Helpers

(这个 add-on 的好处在于我们可以改变外面的壳子为一个新对象，然后对象里面的属性会自动重用老的。等于就是一个浅复制，然后我们就可以在子组件里面使用 shandowCompare 来比较。)

我们有时想要改变对象的里面的某个属性，然后其他的不想改变。例如下图。

```javascript
var old = {a:1,b:{c:1,d:{e:12\}#\},r:{f:1\}#\};
var newData = Update(old,{b:{c:{$set:2\}#\}});
console.log(old === newData);//false
console.log(old.b === newData.b);//false
console.log(old.b.d === newData.b.d);//true
console.log(old.r === newData.r);//true
```

### PureRenderMixin

就是如果你的组件是 pure 的，就是说给不变的 props 和 state，render 同样的结果。可以直接 mixins 这个插件。其实就是 shouldComponentUpdate 里面返回了一个 shandowCompare 而已。

### Performance Tools

(这个是个非常好的提供性能的工具，可以让我们查看一定的操作之后，我们页面组件重新渲染的次数，可以让我们进行组件的优化，使用可以参照本项目 DEMO 里的那个 debug-panel，这个是勐喆开发的一个查看工具，内部调用了 start，stop，printWasted，getLastMeasurement 等方法)

<img alt="perf工具" width='400px' src="pics//perf.png" />

这里有个 Perf.printWasted，这个是 react 内部做的深层次比对，发现没有变化，于是 DOM 没有触及，这一块的浪费我们可以在 shouldComponentUpdate 里面通过 return false 来进行阻止。

### Shandow Compare

这个是个最浅层的比较，会对对象的每个属性进行严格等于的比较，然后都相等就返回 false，有改变的话就返回 true。代表着需要更新。

### Advanced Performance

人们使用 react 的原因在于他们希望网站是快速的，并且是响应的。每次 state 的改变导致重新 render 整个子树让人们想知道这样是否影响了性能，React 使用了一些聪明的技术来减少需要更新 UI 时的 DOM 操作。

首先线上环境要使用压缩过的 production build

#### Avoiding reconciling the DOM

React 使用的是虚拟 DOM。这种平行的关系阻止了 React 直接创建和接触真实的 DOM。每次 React 的 props 和 state 改变的话。React 都会生成一个新的虚拟 DOM 来和老的比较，如果不相等的话，React 才会尽可能小的改变虚拟 DOM。

在这之上，React 提供了一个组件的生命周期的方法，shouldComponentUpdate，这个方法来阻止虚拟 DOM 比较以及可能的最终的 DOM 的更改。让开发者来缩短整个过程。这个值默认返回 true，默认执行比较以及更新。

我们很多时候的比较其实只是引用地址的比较(shandow compare)，这个基本上都是 true 的，因为我们是在同一个对象上修改的。

我们可以使用 Immutable 这个东西来创建不同的对象，或者使用 Object.assign 来做这件事情。

### Context

React 让我们很容易的跟踪数据流的走向，因为他都是沿着组件树的结构一层层 props 传递下去的。但是有时我们不想要一层层的传递下去，我们可以使用 Context 这个东西。(这个是个实验性质的属性，将来可能会修改)

我们在父组件中(context 的提供者)申明好 childContextTypes 和 getChildContext。然后我们在子组件里面申明好 contextTypes 就可以拿到相关的数据了。如果不申明，那 this.context 就会是一个空对象。

还是建议不要使用这个东西，用了的话，生命周期函数基本都会变化，会新加一个参数 nextContext。会让组件无法被重用。

## REFERENCE

### Top-Level API

#### React

react 是对 react library 的入口，如果我们提前引了这个 script。react 就是 global 的。我们如果是 Commonjs 的项目，也可以直接 require 来引入。

#### React.Component

粗略的看过

### Component API

#### setState

实际上是一个 shandow merge，这个是我们主要使用的更新的方法，我们可以传一个二参在 setState 完成以及以及一个组件 re-render 的时候触发。(注意永远不要手动改变 this.state 的状态，因为接下里调用 setState 可能会导致冲突)

#### forceUpdate

这个方法就是强行刷新，跳过本组件的 shouldComponentUpdate，使用到的组件还会执行 shouldComponentUpdate 的，这个方法主要是为了有些我们的组件渲染不只是一句 props 和 state 的时候使用。建议还是不要使用这个东西。

#### 其他的都被废弃或者即将废弃

### Component Specs and Lifecycle

当我们提供了一个 React.createClass 的时候，我们必须得提供一个含有了 render 的方法的对象。我们也可以可选的包含一些生命周期方法。我们当然也可以使用 ES6 的继承，区别前面也已经提过了。

#### render

这个方法不应该改变组件的 props 或者 state，应该是纯净的渲染，我们可以通过返回 null 或者 false 来表示我们不需要他们的渲染。

#### getInitialState

这个方法只有 React.createClass 才会有，如果我们使用 extends 那种，我们就可以在 constructor 里面进行初始化。

#### getDefaultProps

这个方法会执行一次并且被保存下来，用来初始化。而且必须是 parents 没有设置过，才会被设置。

#### propTypes

这个可以用来检验 props 的输入

#### mixins

这个等于是个小的继承的写法

#### statics

我们在这个里面可以申明静态方法，注意这个里面的方法我们没法访问到 props 或者 state。

#### displayName

这个主要是用在 debug 的时候，JSX 会默认设置一下的。

#### Lifecycle Methods

各种各样的方法会在组件的各个时间段执行

##### componentWillMount

这个方法会在 render 之前被执行一次，只执行一次，我们可以设置 state，这个客户端和服务器端都会执行

##### componentDidMount

这个方法在客户端会执行一次，第一次 render 之后会执行一次，只执行一次，在这里我们使用 children 的 refs 了。

##### componentWillReceiveProps

在组件接收到新的 props 的时候被触发，注意第一次不会被触发。

这个方法是让我们在接收到新的 props 的时候，在 render 触发之前还有一个机会通过 setState 来改变 state。

##### shouldComponentUpdate

这个方法是在 render 之前当新的 props 或者 state 接收到的时候，这个方法初次 initial 的时候不执行，forceUpate 的时候也不执行。

使用这个我们可以通过 return false 来阻止 render。如果 shouldComponentUpdate return 了 fasle，componentWillUpdate 和 componentDidUpdate 都不会触发了。

##### componentWillUpdate

这个方法会在我们更新的 render 之前执行，初次渲染不会执行。（注意我们这个方法里面没法调用了`setState`了，如果我们想要因为 props 的改变动 state 的话，我们就在 componentWillReceiveProps 里面执行这个操作）

##### componentDidUpdate

这个方法会在 update 执行之后，初次渲染不被执行，这是个机会我们去操作 DOM。

##### componentWillUnmount

这个在 Component 被移除 DOM 的时候执行，我们可以使用这个方法来清理一些定时等等。

### Tags and Attributes

react 尝试支持 HTML 和 SVG 里面所有的元素，基本所有小写的元素都可以。使用 svg 的话，其实我们也可以使用 react-art 来绘制。

#### Supported Attributes

react 支持所有的 data-和 aria-的属性，所有的属性都是驼峰式写法。注意 class 变成了 className，for 变成了 htmlFor。这样主要是为了去适应 DOM 的 API。

#### 这一页基本就是支持的属性了

### Event System

#### SyntheticEvent

它提供了浏览器所有的本身的事件，并且每个 event 对象里面都拥有了 bubbles，defaultPrevented 等等全部的属性。我们可以通过 e.stopPropagation()或者 e.preventDefault 来达到我们想要的效果。

#### Event pooling

这个合成事件是被放在池子里的，也就是说事件对象会被重复使用，事件对象的所有属性将会在事件被触发之后置为 null。就是说我们在事件处理的过程中如果有了一个异步的过程，那事件对象将会被设置为 null。如果想要在异步的过程中访问，我们可以调用 event.persist()来将这个 event 从池子中放出来。

#### Supported Events

已下列出的所有的方法都是在冒泡阶段发生的，想要在捕获阶段得到事件的响应，我们只需要在后面加上 Capture 就行了。

#### 这里列了很全的事件

我感觉 react 做的很成功的一件事就是统一了这些事件在各个浏览器的属性。而且完美兼容了 DOM 的 API。

### DOM Differences

这里解释了 react 之所以使用驼峰式属性的原因，是因为这样的设计就不太正常

因为 class 和 for 是 js 的保留字，而且正好 dom 提供的叫做 className，所以我们要换成 className 和 htmlFor。但是上面只是 build-in 的 DOM nodes 组件，如果是我们自己的 custom 的组件，直接使用 class 和 for。

onChange 事件也被修改过，按照人们的意愿来触发，而不在 blur 的时候触发。

还有就是 textarea 的值被放到了 value 里面。

### Special Non-DOM Attributes

react 还提供了一些不存在 dom 中的属性。

- key 是为了保证这个组件被创建并且记录
- ref 就是一个指针的感觉
- dangerouslySetInnerHTML 就是一个让我们插入 html 文本的东西

### Reconciliation(和解)

react 的 key 的设计是为了看起来每次 update 的时候 react 都在重新渲染整个 APP。这让 APP 写起来更简单了但是让他易于管理变成了挑战。这篇文章解释了我怎么把一个 O3 方的问题变成了线性的。

#### Motivation

最小的转化把一个树转换为另一个树是一个复杂的问题。如果 n 是树里的 node 的个数，那我们需要比较 n 的 3 次方次。

CPU 的功率并不足以我们来针对 1000 个以上的 node 在 1s 内进行比较。鉴于算法不可控，我们实现了一个基于两点假设的启发式算法。

- 不同 class 的组件会渲染不同的，同样 class 的组件会渲染类似的
- 提供一个独一无二的 key 在不同的渲染中。

在实践中，这两个假设在几乎所有的现实例子中意想不到的快。

#### Pair-wise diff

为了比较两棵树的不同，我们先要比较两个 node，有 3 种 case 要处理

- 不同的 node type：当做两个不同的子树，扔掉第一个，插入第二个(原生的或者自己的都是)，react 快速处理了这些本质不同的，集中精力于那些可能相似的。
- DOM nodes：当比较两个 DOM nodes 的时候，我们比较他们的 attribute，可以在线性的时间内决定谁修改过了。然后 style 属性还被整成了 k-v 的值，很容易进行修改，然后在所有的 children 上递归就行了
- Custom Components：我们决定两个组件是一样的，react 会在老的组件上调用 componentWillReceiveProps()和 componentWillUpdate()，使用新的组件的所有属性。

#### List-wise diff

react 会一次比较完，然后根据不同的地方生成一个突变的方法。就会比较傻一点。但是使用一些高级的算法来做这件事有些得不偿失，所以 react 推出了 key 这个东西，通过这个 key 来帮助比较，就会效果好很多了。注意 key 只需要在 silbing 里面是独一无二的就行了，并不需要是全局的。

#### Trade-offs

这两个假设也在不断的修改来适应实际。如果我们无法说明子树搬去了那里，那么子树将会被重新渲染。

注意如果假设不同的 class 渲染是不同的，如果我们想相同的话，不如变成同一个 class。

注意 key 最好是有价值的，如果是随机生成的可能会有不好的事情发生。

### Web Components

react 和 Web Components 是为了解决不同的问题，Web Components 是为了重用组件而存在，react 仅仅是想提供一层 view 层。两个是可以相互使用的。

### React (Virtual) DOM Terminology

就是区分一些术语：

- React Elements：就是我们通过标签名创建的 react 的元素，
- Factories：其实就是 React Elements 包了一层的 type，
- React Nodes：可能是 ReactElement，string，number 或者 Array of ReactNodes
- React Components：这个就是我们自己明明的组件了，我们永远不要自己来 new，通过 createClass 或者 jsx 来创建好了

## TIPS

这里主要就是一些细节的点了

### Inline Styles

在 React 里面，我们想要使用行内式样的话，必须以对象的形式申明，而且必须是驼峰式，行内样式本来就不推荐，这里也就了解一下感觉就够了。

### If-Else in JSX

JSX 里面我们没法使用 if else，因为 JSX 只是一个来处理函数调用以及对象构建语法糖，最多只能处理 3 目运算符。如果想要使用 if else 也可以，只要在 JSX 外面使用就好了。或者写成一个自执行的匿名函数调用。

### Self-Closing Tag

就是说 react component 都可以自封闭，包括 div 什么的，因为他们本身也就是 react 的 component。

### Maximum Number of JSX Root Nodes

目前，render 里面只允许返回一个 root nodes。如果我们想要返回多个的话，我们只能用一个将他们包装起立。

### Shorthand for Specifying Pixel Values in style props

就是说在行内的 style 属性中，当我们写一些长度属性的时候，React 会帮我们自动加上 px 这个单位，这里也介绍了一些不会加的，不过行内的用处不大，这里了解下就好了。

### Type of the Children props

我们在 componentDidMount 中可以通过 this.props.children 来访问到组件内部包裹的组件。如果包裹的数量大于 1 的话，这个值就是一个数组，如果是 1 的话，这个值就是一个单个的值，并没有用数组包起来，所以提供了 React.Children utilities 来访问。

### Value of null for Controlled Input

我们正常给 input 设置了 value 之后我们是无法修改他的值的，但是我们把 input 的 value 设置为 null 或者 undefined 之后，input 就变的可以编辑状态了(但是我这种赋值并没有价值，这只是一种错误的状态)

### componentWillReceiveProps Not Triggered After Mounting

这个方法并不会在初次 mount 的时候执行，因为他的作用在于比较老的 props 和新的 props，如果老的没有的话，就不会触发。

### Props in getInitialState Is an Anti-Pattern

我们在 getInitialState 里面使用 props 来设置 state 需要注意一下，因为 getInitialState 这个方法只会在初始化的时候被执行一次。

### DOM Event Listeners in a Component

就是说我们最好在 componentDidMount 这个方法执行之后进行 DOM 上事件的绑定，因为这个时候渲染已经完成了。

### Load Initial Data via AJAX

让我们在 componentDidMount 里面拉取 ajax 数据，然后在 UnMount 方法里面 abort 掉这个 request。

### False in JSX

false 在 jsx 里面的渲染结果会有些不同，比如 false 作为 id 或者 value 等等的值就会被解析为字符串“false”，如果在 div 中间使用{false}，就会得到一个空白的 div。

### Communicate Between Components

想要父组件与子组件交流，很简单的传输 props 就可以了，想要子组件与父组件交流，只需要 func.bind(this,i,props)这样绑定一下就好了。

如果是没有父子关系的组件之间的交流，我们可以设置自己的时间系统，在 componentDidMount 里面订阅，然后在 willUnmount 里面取消订阅。

或者按照 flux 来解决。

### Expose Component Functions

将方法暴露给父组件来调用，其实就是父组件创建的时候给个 ref 值，然后在父组件里面使用 this.refs.item1.func()就可以调用子组件的方法了。

### this.props.children undefined

children 这个属性并不指的是自己的 render 方法里面的子，而是调用这个组件里面传入的子。注意调用我们自己包装的组件时，在里面包的 div 并不会渲染，除非我们自己在组件里面的渲染中调用{this.props.children}来手动渲染。

### Use React with Other Libraries

我们完全可以不整个的使用 react，我们可以在 shouldComponentUpdate 里面手动 return false。我们可以在 DidMount 里面进行一些事件的绑定。在 DidUpdate 进行一些处理。但是这是件 tricky 的事。

### Dangerously Set innerHTML

一般 React 会帮我们编码一下吐到页面上，基本不会有 XSS 攻击，但是有时我们想要自己生成 html 吐到页面上，react 提供了 dangerouslySetInnerHTML 这个 function，传入的数据是{\_\_html:'haha'}，注意这个就是有风险的，而且我们基本完全可以避免，除非一些非常特别的 case。
