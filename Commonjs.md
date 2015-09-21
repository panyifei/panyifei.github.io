
# Commonjs规范


commonjs是服务器模块的规范，**nodejs**实现了规范

- 单独的文件就是一个模块，每个模块拥有自己的作用域；

- 通过`module.exports`来将对象和方法抛出去；

- 通过`require`来引入，就可以访问挂载的对象，并且直接调用变量；

## 每个模块

- 每个都有个module对象，这个对象不是全局变量，而是**本地变量**
- exports  = module.exports，可以放弃使用exports，只使用module.exports

	

>**CommonJS**就是个**同步加载方案**，因为服务器一般文件都在本地硬盘，所以加载比较快

---

# AMD规范
AMD是

---

# Cortex
[张颖老师](https://github.com/kaelzhang)的[cortex](https://github.com/cortexjs/cortex)，是一个前端解决方案，类似于npm，提供了模块的管理，加载，本地调试。目前用在点评网的所有的前端项目上

###思想
将多余的事情交给框架

让前端工程师注重在业务逻辑上

解决公共模块版本问题

### Tip
- 一个页面可以通过引入多个facade来引入多个项目的前端资源，这样来解耦了页面
- 这些的模块依赖是在服务器端已然直销并且可以拼装出来了，通过一些算法进行合并和修饰

