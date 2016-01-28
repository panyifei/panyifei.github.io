# 20JSON
Json的语法可以是接下来的三种方式

- 简单值，除了undefined不行，其他都可以，null是可以的！！！！
- 对象，就是个复杂类型嘛
- 数组

## 对象
`对象的属性必须加上双引号`！！！这在JSON中是必须的

## 解析与序列化
JSON比xml火的原因在于在转化为js对象之后，xml需要在DOM树中来获取，而json可以像js对象一样拿取值。

### JSON对象
#### eval解析法
解析最开始的时候可以使用eval，注意这里需要用`小括号包裹住`才认识

```javascript
eval('({"a":1})');
```

#### JSON对象parse解析
JSON.parse可以直接解析

#### JSON对象stringify序列化
JSON.stringify可以执行序列化，这个方法三个参数

- 第一参：对象
- 第二参：过滤器
- 第三参：缩进情况

如果二参是数组，那么序列化只会保留数组中列出的属性。

```javascript
var book = {
    "title":"hah",
    "name":"aa",
    "beta":"a"
};
var jsonText = JSON.stringify(book,["name","beta"]);
//"{"name":"aa","beta":"a"}"
```

如果二参是函数的话，也就是个筛选的函数

```javascript
var jsonText = JSON.stringify(book,function(key,value){
    switch(key){
        case "title":
            return value;//这里会返回值
        case "name":
            return undefined;//这里就会直接忽略
        case "beta":
            return 111;//这里就是手动赋值了
        default:
            return value;//这句加上才能保证其他的正常返回
    }
});
```

第三参用来控制缩进和空白符
- 比如4个字符，注意这里默认会加个换行符的，因为光缩进不换行也没有意义
- 如果超过10个字符，会被设置为10的
- 也可以用string，这个时候就会替代空格

```javascript
var jsonText = JSON.stringify(book,null,4);
```

可以在一个对象上改写toJSON方法，作为过滤器的补充。

这里的顺序是先应用toJson方法，然后应用第二个参数的函数过滤器，然后序列化，然后应用第三个参数的格式化。

#### 解析的选项
JSON.parse()也是可以提供一个函数来作为还原函数，函数参数为key和value。