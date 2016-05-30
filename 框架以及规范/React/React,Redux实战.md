## React,Redux实战

###　触发自己的方法，对this.props进行访问
需要先在constructor里面进行绑定

`this.publish = this.publish.bind(this);`

### 运行时修改this.props
无法在运行过程中直接对this.props进行修改，我们只能为之写一个action来触发，然后重绘。

### 访问url里restful传入的id
使用`this.props.routeParams`可以访问。

### 防止jsx对html结构进行转义
```html
  <div dangerouslySetInnerHTML={{__html: apiDetail}}></div>
```

### action的处理过程
action会触发reducer，然后通过reducer里面对action.type的判断来决定页面上this.props的值。这里的值可以由全局的state和action里面的data混合着返回。

然后就会触发页面上`componentWillMount`的方法，进而对页面进行重绘。

### 在render里面可以将jsx先放在一个变量里
我们在render绘画的时候，可能根据不同的情况return不同的结果，如下：

```javascript
  if(true){
      button = <button className='blue'>从暂存恢复</button>;
  }else{
      button = <button className='blue disable'>从暂存恢复</button>;
  }
  return(
    {button}
  );
```

### 方法的执行顺序
componentWillMount是在开始渲染之前

componentDidMount是在开始渲染之后

componentDidUpdate是在更新之后

### render方法的执行条件
如果我们在父元素里面调用了render，那么子元素肯定执行render的。

如果我们想要阻止子元素的render，我们可以在子元素里面进行shouldComponentUpdate来进行compare。我们可以使用shallowCompare来简单的比较引用是否改变。因为如果我们想要传新对象的话，这个肯定会渲染的。而如果我们还传老的对象，代表我们并没有修改。层次比较多的时候我们可以使用update这个add-on来执行我们的更新操作。
