---
layout: default
title: {{ site.name }}
---
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
## CORS(cross origin resource sharing)
定义了在必须访问跨源资源时，浏览器和服务器如何沟通。

思想是使用自定义的HTTP头部来决定请求或者响应是否成功。

在发起请求时带一个Origin:http://www.baidu.com

然后在后端返回的时候给一个Access-Control-Allow-Origin，里面可以是‘*’或者一个特定的网址。

如果没有或者不符合的话，浏览器就会驳回请求。

这里IE是推出了一个XDR对象，和XHR很类似。

而其他的浏览器则是在原生的XHR上做了实现。


## 图像Ping
使用图像来发送请求是最简单的单项通信了,这个东西最适合来做监控或者说是打点了。因为无法得到服务器端的数据，只能发送GET请求

```javascript
var img = new Image();
img.onload = img.onerror = function(){
alert('done');
}
img.src = 'http://www.example.com/test?name=Nicholas';
```

## JSONP
JSONP是通过动态加载一段js来做到的，就是先声明了一个function，插入到body中。

把function的name交给后端，后端返回一段方法的调用，并且传入参数。

浏览器接收到的实际上就是script，会直接调用那个申明好的方法。

## Comet
这个有长轮询和短轮询和流
### 短轮询
浏览器定时向服务器发送请求，然后不停地刷

### 长轮询
浏览器向服务器发送请求，服务器保持链接的打开，等到有数据传送的时候发送数据。

浏览器接收好数据之后，再打开一个新的连接。

    轮询的好处在于所有的浏览器都是支持的

### 流
就是说整个的周期只使用一个HTTP请求，然后服务器保持链接打开，然后周期性的发送数据，然后xhr的readyState就会周期性的变成3了。

如果是XHR实现的话，如下：

```javascript
xhr.onreadystatechange = function(){
    var results;
    if(xhr.readyState == 3){
        result = xhr.responseText.subString(received);
        received = reslult.length;
        //然后处理最新的数据
    }else if(xhr.readyState == 4){
        //处理结束的任务
    }
}
```

### SSE API
这个必须得是同源的，并且是个单向的连接，默认情况下，这个会保持与服务器的活动链接，如果断开了还会自动重连。

响应的MIME类型是text/event-stream，是纯文本

我们也可以使用event.close();来强行断开这个连接并且不再重连。

```javascript
var source = new EventSource('tesr.php');
source.onmessage = function(event){
    var data = event.data;
}
```

## Web Socket

- 在一个单独的持久链接上提供双全工，双向通信。
- 创建后，会有HTTP请求发送到浏览器，取得服务器响应之后，连接会从http协议变成web sockets协议
- 协议是自己定的，所以是ws:www.example.com

web socket支持情况非常差，但是没有同源策略的限制，连不连接全依靠服务器端来识别。

一旦尝试创建，会有一个readyState表示状态，想要关闭，可以在任何时候调用close方法。

一旦打开了之后，就可以来send任何的数据，但是只能发送纯文本，所以必须先JSON.stringify才行。

一旦受到消息，会触发onmessage方法。

还有一些方法，比如open，eror，close会在相应地时刻触发。

## 安全
#### CSRF
cross-site-request-forery 跨站点请求伪造

注意改变get变成put，检查来源，检查cookie都不行

可以的解决方法：

- 以ssl来访问可以通过XHR请求的资源
- 每次请求都得到附带响应算法的验证码






tudo:跨源资源共享那里还有些问题。
tudo:ssl是啥？
