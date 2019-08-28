---
layout: default
title: Reselect
---

# Reselect

这个库的功能挺强大的，源码超级短，看下源码好了。

### defaultEqualityCheck

默认的相等检查，默认比较引用

### areArgumentsShallowlyEqual

检查两次的参数是否相等，默认 foreach 对比引用

### defaultMemoize

核心函数：比较前后两次的参数，如果相等，就返回上次的结果，并存新参数。否则计算新结果，存新参数。

### getDependencies

拿到所有的依赖，就是最后的计算方法之前依赖的所有的结果

### createSelectorCreator

先拿到 resultFunc，就是最后生成的函数

然后拿 dependencies，就是这个 selector 的输入依赖

memoizedResultFunc 就是将 resultFunc 变成缓存的，调用两次就会打到缓存

selector 就是算一下所有的参数的函数，然后调用 memoizedResultFunc。

### createSelector

就是调用了 createSelectorCreator(defaultMemoize)

## 不足

reselect 只提供了一个缓存值，并没有多加一些 cache。从 issue 里面找到了一个解决方法。

很简单其实，就是加了个缓存，从最新往前遍历，找不到的话，就更新在最新的位置。

## 看下官方推荐的 re-reselect

这个等于就是加了 lodash 的 memorize，没什么意思，我需要提供自己的 key，太诡异了。
