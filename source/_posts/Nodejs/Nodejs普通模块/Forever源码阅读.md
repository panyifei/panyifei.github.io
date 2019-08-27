---
layout: default
title: Forever源码阅读
---

[forever](https://www.npmjs.com/package/forever)是一个用来在服务器端一直运行 nodejs 项目的 npm 的模块。自己开始尝试尝试读源码，所以会比较细致一点。

    先从目录结构开始看

## .tracis.yml

这是个用了 travis ci 管理的项目。申明了运行环境，包括 nodejs 的几个版本，这里跑的 test 使用的 vows。vows 也是一个测试工具，与 mocha 类似，但是貌似不如 mocha 的使用.

## .jshintrc

这个文件是定义了 jshint 的格式，主要是用来规范编程风格的，配置了之后直接 jshint 加上想要查看的文件就行了

## .editconfig

也是用来标注项目文件的格式的，可以在 sublime 或者 webstorm 中安装插件来支持这个文件，现在支持的格式不多，也就缩进，tab 空格而已

## .gitignore

这个就是 github 的规范了，添加了的文件就不会被提交到仓库中

## package.json

这个文件是 npm 的配置，主要是 bin 这个配置，可以在安装后，使用命令时调用对应的 js 文件。

其他的几个文件的作用就不解释了

## bin 文件夹

先看这个文件夹下面

### forever 文件

提供了 bin 的窗口，就是调用了 lib 文件夹下面的 cli.js

### monitor 文件

todu:还没看

## lib 文件夹

### forever 文件

todu:还没看

### forever 文件夹

#### cli.js

主入口，先引用了一些 npm 的包。

`colors`来在 nodejs 命令行里面打有颜色的 log 用的。

`cliff`是用来将数据进行格式化的，提供了输出到命令行中的接口，本身依赖了`colors`。

`path-is-absolute`是用来判断传入的路径是不是绝对地址的，用来判断当前环境是 windows 还是 linux。

`flatiron`这个是用来配置并且创建 app 的，包括浏览器端的 app，包括命令行端的，这里主要使用了命令行端的。

`shush`这个是用来引入包含了注释的 json 的，这样引入的 json 可以包含`//`。

`prettyjson`这个是用来在命令行输出比较好看的 json 的，也依赖了`colors`等等。

`clone`这个是用来复制对象的。

`object-assign`是用来赋值的，可以将对象的相同属性替换掉，现在作为 es6 的 pollfill 了。

然后引用了 lib 下的 forever 文件。

然后申明了帮助列表，通过 flatiron 初始化了 app，申明了 action，声明了 action 的参数。

使用`flatiron`的方法将 app 的命令行参数以及帮助文档初始化。

```
app.use(flatiron.plugins.cli, {
  argv: argvOptions,
  usage: help
});
```

然后申明了一个内部方法 tryStart，用来转换路径，尝试唤起

申明了一个 updateConfig 用来更新 forever 的配置

申明了一个 checkColumn 来 j 检测 name 是否存在

然后抛出了一个 getOptions 方法

##### getOptions 方法

传入了 file 文件，先通过`path-is-absolute`来判断是不是绝对的路径，不是的话就通过 path 将路径拼装一下，使用 process.cwd()得到路径。

#### worker.js

todu:还没看
