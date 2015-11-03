# 20JSON
Json的语法可以是接下来的三种方式

- 简单值，除了undefined不行，其他都可以
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