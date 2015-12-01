# Forever源码阅读
[forever](https://www.npmjs.com/package/forever)是一个用来在服务器端一直运行nodejs项目的npm的模块。自己开始尝试尝试读源码，所以会比较细致一点。

## 目录结构
首先.tracis.yml，这是个用了travis ci管理的项目。申明了运行环境，包括nodejs的几个版本，这里跑的test使用的vows。