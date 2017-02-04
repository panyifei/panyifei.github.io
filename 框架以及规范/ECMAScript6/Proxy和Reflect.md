---
layout: default
title: {{ site.name }}
---
# Proxy和Reflect
## Proxy
用于改变某些操作的默认行为，在语言层面做出的修改，属于"元编程"。对变成语言进行编程。

```javascript
var proxy = new Proxy({},{
    get: function(target, property){
    },
    set: function(target, key, value){
    }
});
```

Proxy作为构造函数，接受两个参数，第一个是要代理的目标对象，第二个是一个配置对象。注意如果要使得Proxy起作用，必须针对Proxy对象进行操作。如果配置对象没有设置任何拦截，那就等同于直接通向原对象。

### 拦截的操作

 - get：拦截对象属性的获取
 - set：拦截对象属性的设置
 - has：拦截propKey in proxy的操作，返回一个布尔值
 - deleteProperty：拦截delete操作
 - ownKeys：拦截返回所有的可遍历的属性数组的操作
 - getOwnPropertyDescriptor：返回属性的描述对象
 - defineProperty：就是拦截defineProperty
 - apply
 - ...

 也就是基本都是可以拦截的了

### 收回代理
Proxy.revocable其实就是返回一个可以被取消的Proxy实例。

```javascript
let {proxy, revoke} = Proxy.revocable({}, {});
revoke();
```

就是在目标不允许直接访问的时候，可以通过代理访问，一旦访问结束，就可以收回代理权，不允许再次访问。

### this问题
Proxy不是目标对象的透明代理，因为在设置了Proxy代理的情况下，目标对象的this关键字会被指向Proxy代理。这个的问题很大啊。

### 用处
就是拦截目标对象的任意属性，可以来做很多的事情，访问某个属性的时候可以拦截下来，做其他的事情。

## Reflect
