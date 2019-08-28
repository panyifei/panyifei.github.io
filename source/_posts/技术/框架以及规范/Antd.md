---
layout: default
title: \{#\{ site.name }}
---
# Antd
### 写代码的时候尽量不要用自己的state
一个是用了自己的state就完全没法恢复了，并不能够从外部传入的props完全还原，尽量不要让自己来管理state。只在比如说antd的form的时候让他来控制state。总结就是不要自己去控制state。

### form自定义校验规则
antd的form如果复杂一些，肯定得拆出一个组件来，然后通过第三方的校验规则写判断，如果要求是比较复杂的判断逻辑的话，最好提前抽离。

### 空字符串触发props的检验失败
写组件的时候会申明好组件的props，然后在inputNumber组件删除至回车的时候，会传一个空字符串，这个就触发了props的校验失败，所以最后使用了oneof这种东西。

### form的初始状态设置
如果是checkbox类型的，设置getFieldDecorator的时候，要告诉他valuePropName为“checked”，这样子form才知道他对应的布尔值控制的是哪个属性~
