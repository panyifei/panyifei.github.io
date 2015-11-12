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
响应数据自动填充XHR对象的属性，包括：

- responseText：作为响应主体被返回的文本
- responseXML：如果是'text/xml'或者是'application/xml'，就会包含XML DOM文档
- status：可以将status状态码等于200作为成功的标志，304代表可以从缓存拿，也是正确的
- statusText：HTTP状态的说明

注意204状态码可能会有问题

### 异步的监听
就是在`open方法调用之前`，重写下onreadystatechange。
```javascript
xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
    //这里的状态有4种，一般4代表完成了
    }
};
```

在接收到响应之前还可以调用abort方法来取消异步请求。取消之后，还得对XHR对象进行解引用的操作

## HTTP头部信息
我们可以在open方法之后，send方法之前调用`setRequestHeader`方法来设置成自己想要的值。

`getResponseHeader`方法可以得到对应的值，加个`s`就可以得到所有的头部信息。

## GET 请求
get请求的情况最多，一般就是将查询字符串参数追加到URL末尾。

最容易发生的错误是未将名称和值通过encodeURIComponent方法来转码。

注意所有的名值对都必须使用`&`分隔才行。

## POST 请求
想支持POST的数据，就得模拟form表单
在open方法之后

```javascript
xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
```

原来post和get方式传输的数据其实是一样的，也是一个&分隔的string！！！

# XMLHttpRequest 2级
2级并没有得到全部的支持
## FormData
可以帮助你来将数据数据序列化，这些东西jquery帮我们做的太无感了
```javascript
var data = new FormData();
data.append('name','Nicholas');
```

## 超时设定
这个东西只有IE8支持，jquery啥的都是用的自己的timeout

```javascript
xhr.timeout = 1000;
xhr.ontimeout = function(){...}
```

## overrideMimeType方法
用这个方法可以强行改写服务器端返回的数据的解析方式，这个方法必须在send之前调用。这个方法略不讲道理啊，和服务端好好商量下不行吗。。。

```javascript
xhr.overrideMimeType('text/xml');
```

## 进度事件
主要就是下面的6个状态事件

load可以用来替代readystatechange事件，但是实现不太一致

### progress事件
这个主要是可以监测xhr得到的数值的进度~~这个有些屌啊，这个东西得在open方法之前调用

```javascript
xhr.onprogress = function(event){
    event.lengthComputable//得到进度信息是否可用
    event.position//当前的位置
    event.totalsize//总共的预期的数据
}
```

# 跨源资源共享










