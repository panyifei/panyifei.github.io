# React文档阅读
## quick start
### Tutorial
#### 建立一个模块
我们可以使用React.createClass()来创建一个React模块。我们通过一个JS对象传了一些方法给这个函数，最重要的方法是render，返回了最终会变成HTML的部分。

render里面的div不是真正的DOM节点，他们是React的div components的实例化，不直接产生HTML，所以XSS保护是默认的。

我们使用ReactDom.render()来实例化入口框架，这个方法必须在最下面模块定义好了才执行，这个方法来真正的产生DOM，其他的平台的话有其他的生成方式，比如React Native。

HTML tags在生成的时候会调用React.createElement(tagName)来创建。

#### this.props
由父模块传递给子模块的数据，我们可以在子模块中通过this.props来访问得到。

#### dangerouslySetInnerHTML
如果我们想要直接插入html进入文档中(这一点需要自己来保证XSS的问题)，我们可以使用dangerouslySetInnerHTML这个属性来添加。

#### 遍历输出

```javascript
var commentListNodes = this.props.comList.map(function(comment){
    return (
      <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
    );
});
```

我们可以通过map方法来得到数组，然后使用的时候直接{commentListNodes}就能输出了。

#### state
目前，依赖于props，所有的组件都是被刷新了一次，props是不变的，这个被父组件传过来的且被父组件拥有。所以出现了state这个属性，我们使用这个可变的私有的值来改变状态。我们可以使用setState()来rerender这个组件。getInitialState这个方法会在初始化的时候执行一次来初始化组件的初始状态。

#### componentDidMount
这个方法会在组件第一次初始化之后被调用

#### 控制组件的输入
这里推荐的也是在this.state里面存这个value，在input的onChange时调用修改this.setState来改变。包括submit方法的话就是监听onSubmit。我们可以先调用e.preventDefault()来阻止默认行为。

#### 从子组件传数据给父组件
我们可以在调用子组件的时候，将callback绑在props上，然后调用子组件的props上面的方法来调用父组件相应的方法。

#### 我们在写一些回调的时候要绑定好this
```javascript
  $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this)
  });
  //就像这样绑定好this
```

#### Tip
这里还给了一个小建议，我们在添加了某一项之后，可以直接加进list，如果ajax失败了再重置回去

### Thinking in React
#### 创建react的步骤
我们分解成react要尊崇单一职责原则，尽量把交互与展示分开，展示也根据种类分细点

然后我们先不考虑交互，不考虑传输的数据，先创建一个静态的项目出来

react是单项绑定的

然后我们要计算出最小的state我们需要什么，通过父组件传的，不变的，能够通过其他state计算得到的都不应该是state

我们需要得出哪一块需要数据，如果我们实在没法区分的时候，我们可以专门在其上用一个组件来专门管理state

## 社区资源
这个就先不看了

## Guides
### why react
React就像是MVC的view层，react主要解决的是大项目数据不断变化的场景。我们只需要修改数据，react会帮我们进行所有的UI更新。

他只更新被改变的部分。

### Displaying Data
他的组件是很封闭的，所以更容易重用，更容易测试以及分离相关。

Components更像是方法，接受props和state来生成HTML。(react模块只能生成一个简单的根节点，如果想要返回大量的节点的话，得用一个根节点包裹起来)

React允许我们用js对象的形式来创建HTML，如`React.createElement('a',{href:''},'Hello!')。为了简便，我们还可以使用createFactory的形式来创建。但是使用比较少，还是JSX比较方便。

JSX时间上只是一种语法，并不是使用React的必需品，不用的话，就得像上面一样使用create的形式慢慢创建。

### Jsx in Depth
我们在JSX里面使用HTML tag的时候，用小写的形式。如果是HTML属性的话，使用驼峰的写法。并且因为class和for都作为XML的本身的属性名，所以我们分别用className和htmlFor来代替。

我们在版本0.11以上可以使用namespaced components，就是在某个组件之下进行申明。

当我们在属性里想要使用js的表达式的时候，用一个大括号包裹起来，替代双引号。

boolean attribute，如disable，readonly，checked，required直接省略属性值和{true}一样，如果不写和值为{false}效果一样。

js表达式也可以用来申明生成哪个子节点，比如{ifShow ? <Nav/> : <Login/>}。

注释的话使用这种形式是可以的{/*   */}。

### Jsx 延展属性
我们可以使用延展属性，来讲一个对象所有的属性复制到另一个对象上。我们可以多次使用，或者和普通的属性一起用，不过得注意顺序，后面的会覆盖前面的。这里是React直接支持。

```javascript
var props = {foo:"check"}
var component = <Component {...props} foo='name'/>
console.log(component.props.foo);
//name
```

延展属性在ES6的效果主要是将数组类型的一个个推出来，就像是apply方法一样，支持情况当然不好啦，但是Bebal可以转。

### JSX 一些陷阱
如果想插入&middot;这种符号的话，我们可以直接插入，但是如果想插入动态的话，我们就会以这样的形式包装起来{'&middot;'}，然后就没法显示了

我们可以直接以UTF-8的形式写个点，或者我们可以写unicode的编码\u00b7，或者我们用个span包起来，例如`{['First ', <span>&middot;</span>, ' Second']}`，或者我们可以直接dangerouslySetInnerHTML={{__html: 'First &middot; Second'}}这样来强行插入原始的HTML。

原生的HTML的自定义属性必须以data开头，自定义的节点的属性可以是任意的，aria-hidden这种aria-开头的属性是可以正常render的。

### 交互以及动态UI
他自动把方法绑定在模块上，是使用的事件代理，完全绑在了根元素上。

模块就是状态机。

通过setState来将data merge进入this.state中，这里的merge只有一层，如果想深层次的merge，使用那个`immutability helpers`

所以我们应该有许多stateless的模块来负责渲染，然后在其上有一个stateful的模块来将state通过props传给这个模块。

计算过的数据，react模块以及与props里面重复的数据都不应该在State里面出现。

### Multiple Components
动机主要是将关注点分离。

组件自己没法修改props，这样可以保证组件是始终如一的。Owner负责修改以及传递状态。

注意Owner和Parent是不一样的，`<Parent><Child/></Parent>`这个是parent，而owner是React.createClass。我们可以在Parent里面使用this.props.children来操作。

我们最好不要用hide来隐藏，我们应该直接让他们消失，对于list生成的我们需要给每一个一个唯一的key来保证他们正常且不别破坏。

数据流是单向绑定的。

JS执行的速度是非常快的，所以基本上没有性能瓶颈。主要的瓶颈是DOM的渲染，而这点React帮我们通过批处理以及脏检测来优化过了。

当我们真的感觉到性能问题的时候，我们可以重写shouldComponentUpdate来让他返回false就可以了，但是其实不是很需要。

### Reusable Components
设计接口的时候，将那些简单设计的元素分解为可重复使用的，良好设计的接口。下次就可以复用了。

为了保证我们的组件被正确的使用，我们可以通过设置propTypes来限制用户传入的数据，但是这个东西只有在`development模式`才会有效。

#### default prop values
我们可以在用户没有传的时候设置一个默认值，调用getDefaultProps就可以设置默认值了，如果用户设置过的话，就会被忽略

#### Transferring Props: A Shortcut
有的时候我们想要从父元素传递props给子元素，我们可以直接使用spread syntax来简写，比如直接{...this.props}这样。

#### Mixins
当不同的组件拥有相同的功能的时候，我们可以使用mixins，这个就是将组件的功能进行抽离的一个方法，还蛮有意思的。使用的时候加个`mixins: [SetIntervalMixin]`就可以了。

一个很重要的有点在于，如果有多个Mixin在同一个生命周期的方法执行，那么他们都会被执行，并且会严格按照申明的顺序执行。

#### ES6 Classes
我们也可以使用es6的class语法来声明组件，唯一不同的是没有getInitialState这个方法，我们只能在constructor里面手动初始化state。

而且方法如果想要在render里面以this来调用的话，必须在constructor里面bind一下this。

还有propTypes和defaultProps得在外面申明，而不是写在里面。下面的例子

```javascript
export class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
    this.tick = this.tick.bind(this);
  }
  tick() {
    this.setState({count: this.state.count + 1});
  }
  render() {
    return (
      <div onClick={this.tick}>
        Clicks: {this.state.count}
      </div>
    );
  }
}
Counter.propTypes = { initialCount: React.PropTypes.number };
Counter.defaultProps = { initialCount: 0 };
```

关于this的绑定，我们可以在调用的时候绑定，也可以使用箭头，不过最好像上面一样在constructor里面绑定，这样只绑定了一次。

```javascript
<div onClick={this.tick.bind(this)}>//bad
<div onClick={()=> this.tick()}>//bad
```

ES6的语法的话没有Mixins的支持。

#### Stateless Functions
如果组件只是一个简单的js function的话，我们可以使用这种语法

```javascript
function HelloMessage(props) {
  return <div>Hello {props.name}</div>;
}
//或者直接使用下面的箭头语法
const HelloMessage = (props) => <div>Hello {props.name}</div>;
```

这种比较适合没有lifestyle方法的，不存有内部状态，我们仍然可以设置propTypes和defaultProps。就像ES6的设置一样。我们的项目应该较多的是stateless的模块。
