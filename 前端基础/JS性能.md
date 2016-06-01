---
layout: default
title: {{ site.name }}
---
# JS性能
## 测时间的函数
```javascript
function test(func){
  console.time("test");
  func.apply(null,[].slice.call(arguments,1));//执行待测函数
  console.timeEnd("test");
}
```

## 输入一个num和code，返回相应长度的string。
```javascript
function get(num,code){
  var array=[];
  while(num>0){
       array[num] = code;
       num--;
  }
  return array.join("");
}
//109ms左右
test(get,100000,'c')
function get(num,code){
  var res = '';
  for(var i= 0;i<num;i++){
    res+=code;
  }
  return res;
}
//24ms左右
test(get,100000,'c');
function get(num,code){
  var res = '';
  while(num>0){
    res+=code;
    num--;
  }
  return res;
}
//13ms左右
test(get,100000,'c');
```

这里没有一些规则还是无法理解呀..
