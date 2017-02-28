---
layout: default
title: {{ site.name }}
---
# Module
commonjs的其实是动态加载，因为只有运行时才能得到对象，没法做静态优化。

ES6模块不是对象，而是export的指定代码，就可以在编译时加载，使得静态分析成为了可能。
### 动态改变
commonjs输出的是缓存的值，而es6的模块是可以`动态更新`的。

### export default
正常的import我们都需要知道所要加载的变量名以及函数名，否则无法加载。所以为了提供便捷，使用export default命令，为模块指定默认输出。

然后在其他模块加载该模块的时候，就可以为匿名函数指定任意名字了。

这个时候import命令就不用加大括号，因为只会有一个export default，所以当没有大括号的时候就是default的。我们可以同时使用default和普通的export。

### export和import的复合写法
import和export是可以结合一起，写成一行。

### import()
无法在if或者函数内部进行模块的加载，必须写在最顶层。所以无法运行时加载模块。require是运行时加载模块，import无法取代require的动态加载功能。

所以就有了import()这个提案，类似于node的require方法，区别是前者是异步加载，后者是同步加载，import()返回一个Promise对象。
