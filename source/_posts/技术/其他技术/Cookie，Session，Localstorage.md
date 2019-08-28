---
layout: default
title: Cookie
---

# Cookie

可以使用`document.cookie=`来设置 cookie

例如

```javascript
document.cookie = "utm_source=weixin; expires=Wed, 14 Oct 2015 07:07:15 GMT; path=/; domain=51ping.com";
```

这里实际上只加了一条 cookie，后面的是对 cookie 的属性进行描述的

# Localstorage

- 没有失效期，除非手动清除
