## React,Reduct实战

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
