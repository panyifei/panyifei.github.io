## React,Redux实战

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

### render方法的执行条件
如果我们在父元素里面调用了render，那么子元素肯定执行render的。

如果我们想要阻止子元素的render，我们可以在子元素里面进行shouldComponentUpdate来进行compare。我们可以使用shallowCompare来简单的比较引用是否改变。因为如果我们想要传新对象的话，这个肯定会渲染的。而如果我们还传老的对象，代表我们并没有修改。层次比较多的时候我们可以使用update这个add-on来执行我们的更新操作。
