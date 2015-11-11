# 21Ajax和Comet
Ajax通信与格式无关，就是XHR来异步拉取数据，然后通过DOM来操作原页面。

## 创建XHR对象
一般直接`new XMLHTTPRequest()`就行了，为了兼容IE7之前的话，需要用`new ActiveXObject('MSXML2.XMLHttp')`来生成。//这里的里面的内容是有三种的

## XHR的用法
### open方法
第三个参数代表是否异步发送。
```javascript
xhr.open('get','example.html',false);
```

open方法只是初始化，并不会发送请求，注意AJAX只能是`同源`的，如果跨域的话，是会报错滴。

### send方法
接受一个参数，是作为请求主体发送的数据，如果不需要传入数据，就得传入null。

```javascript
xhr.send(null):
```

### 响应的结果
响应数据自动填充XHR对象的属性

todo：这里的异步到底是什么样的？
