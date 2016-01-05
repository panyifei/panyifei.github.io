## React
### 想要在input的时候改变props
原来是无法更改自己的props的，只能触发action，重新走一遍所有的流程，直到绘制

### 防止jsx对html结构进行转义
```html
  <div dangerouslySetInnerHTML={{__html: apiDetail}}></div>
```
