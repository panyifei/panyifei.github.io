## Commonjs规范

commonjs是服务器模块的规范，nodejs实现了规范

- 单独的文件就是一个模块，每个模块拥有自己的作用域；

- 通过module.exports来将对象和方法抛出去；

- 通过require来引入，就可以访问挂载的对象，并且直接调用变量；

每个模块都有个module对象，这个对象不是全局变量，而是本地变量

exports  = module.exports
可以放弃使用exports，只使用module.exports

CommonJS就是个同步加载方案