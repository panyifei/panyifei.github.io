# Forever源码阅读
[forever](https://www.npmjs.com/package/forever)是一个用来在服务器端一直运行nodejs项目的npm的模块。自己开始尝试尝试读源码，所以会比较细致一点。

    先从目录结构开始看
    
## .tracis.yml
这是个用了travis ci管理的项目。申明了运行环境，包括nodejs的几个版本，这里跑的test使用的vows。vows也是一个测试工具，与mocha类似，但是貌似不如mocha的使用.

## .jshintrc
这个文件是定义了jshint的格式，主要是用来规范编程风格的，配置了之后直接jshint加上想要查看的文件就行了

## .editconfig
也是用来标注项目文件的格式的，可以在sublime或者webstorm中安装插件来支持这个文件，现在支持的格式不多，也就缩进，tab空格而已

## .gitignore
这个就是github的规范了，添加了的文件就不会被提交到仓库中

## package.json
这个文件是npm的配置，主要是bin这个配置，可以在安装后，使用命令时调用对应的js文件。

其他的几个文件的作用就不解释了

## bin文件夹
先看这个文件夹下面
### forever文件
提供了bin的窗口，就是调用了lib文件夹下面的cli.js

### monitor文件
todu:还没看

## lib文件夹
### forever文件
todu:还没看

### forever文件夹
#### cli.js
主入口，先引用了一些npm的包。

`colors`来在nodejs命令行里面打有颜色的log用的。

`cliff`是用来将数据进行格式化的，提供了输出到命令行中的接口，本身依赖了`colors`。

`path-is-absolute`是用来判断传入的路径是不是绝对地址的，用来判断当前环境是windows还是linux。




todu:还没看
#### worker.js
todu:还没看






