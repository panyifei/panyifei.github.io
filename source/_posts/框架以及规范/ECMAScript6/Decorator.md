---
layout: default
title: \{#\{ site.name \}#\}
---
# Decorator
装饰器模式为了让不修改原类的情况下表现的更好，我们可以给方法加上装饰器，也可以给类加上装饰器。参考自(文章)[http://taobaofed.org/blog/2015/11/16/es7-decorator/]

## 装饰方法
装饰器需要3个参数，target，key，descriptor，这个跟Object.defineProperty的效果一样的。

```
function decorateLight(target, key, descriptor) {
  const method = descriptor.value;
  /*let moreAtk = 50;*/
  let ret;
  descriptor.value = (...args)=>{
    /*args为入参，想做什么，自己定义就好了*/
    /*args[1] += moreAtk;*/
    ret = method.apply(target, args);
    return ret;
  }
  return descriptor;
}
```

## 装饰类
```
function addFly(canFly){
  return function(target){
    target.canFly = canFly;
    let extra = canFly ? '(技能加成:飞行能力)' : '';
    let method = target.prototype.toString;
    target.prototype.toString = (...args)=>{
      return method.apply(target.prototype,args) + extra;
    }
    return target;
  }
}
```

写的言简意赅，让人直接就想用啊！

使用起来确实挺好用的，就是decorator的抽离挺难控制的。
