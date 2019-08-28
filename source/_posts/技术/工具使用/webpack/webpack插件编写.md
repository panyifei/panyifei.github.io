---
layout: default
title: Webpack插件编写
---

之前的项目因为使用了 cortex 的包(一种类似于 npm 的仓库，但是结构不同，有自己的 cortex.json 以及导出结构)，之前的构建流是使用了 cortex 的工具 cortex build。但是现在项目迁为 react+webpack。这个环境不支持 cortex 的包。于是张强同学写了个 gulp 的插件来将 cortex 的包转换成 npm 的模块。于是项目里面就出现了既有 webpack，又有 gulp，以及 cortex 的局面，所以我想要将 gulp 去除掉。

## 思考

想要让 webpack 识别 cortex 的包结构，得改变 webpack 的 resolver。这个可以用 webpack 的插件来做。然后 webpack 读取到了资源之后，可以在 loader 里面对资源进行一定的处理，对于内部 require 的进行识别。

## webpack plugin

其实就是很简单，让他识别 cortex 的目录，然后 doResolve

```javascript
var path = require("path");
//里面有一个方法来读取semver的版本的
var util = require("./util");
var fs = require("fs");
var MyConventionResolver = {
  apply: function(compiler) {
    compiler.plugin("module", function(request, callback) {
      if (request.request.indexOf("@cortex") === 0) {
        var pkg_name = request.request.substr(8);
        var cortex_json_file = path.resolve(__dirname, "../cortex.json");
        var cortex_config = JSON.parse(fs.readFileSync(cortex_json_file));
        var pkg_path = path.resolve(__dirname, "../neurons/", request.request.substr(8));
        var versions = fs.readdirSync(pkg_path);
        var ver = util.chooseCorrectVersion(cortex_config, versions, pkg_name, false, pkg_path);
        var newRequest = {
          path: path.resolve(__dirname, ".."),
          request: "neurons/" + pkg_name + "/" + ver + "/" + pkg_name + ".js",
          query: request.query,
          directory: request.directory
        };
        this.doResolve(["file"], newRequest, callback);
      } else {
        callback();
      }
    });
  }
};
module.exports = MyConventionResolver;
```

webpack 里面的配置

```
new webpack.ResolverPlugin([CortexPlugin])
```

## loader

其实就是对 source 进行处理，将包装过的结构进行还原

```javascript
module.exports = function(source) {
  if (source.indexOf("define(_") != -1) {
    //处理js
    var newSource = util.processJS(source);
    return newSource;
  } else {
    return source;
  }
};
```

webpack 里面的配置

```
resolveLoader: {
   alias: {
       "cortex-loader": path.join(__dirname, 'lib', "./cortex-loader")
   }
}
```

## 另一种实现

勐喆之前也做过一版，他做的是 babel 的插件，他会先通过 babel 解析的语法树得到这个 js 所有的引入，得到一个依赖的列表。然后他写了一个轻量的 neuron 解析器来接住这个依赖列表，在每个 cortex 的包的头部传入进去。这样完成资源的识别。最后我没有选择这种方式，是因为这样子所有的 neuron 资源都会走一遍 babel 的编译，这是个极其耗时的过程。应该避免。而且我的尝试里面如果想要使用他的方法也必须进行一次语法分析的。也会耗费大量的时间，而且打包出来的 webpack 会有冗余代码。

## 总结

我的虽然摒弃了 gulp，但是我在 neuron 里面生成了一些新的目录结构。还是有一些问题的，这里只是记载了问题的整体解决过程，具体代码可以看我的两个模块[webpack-cortex-loader](https://github.com/panyifei/webpack-cortex-loader)和[webpack-cortex-resolve-plugin](https://github.com/panyifei/webpack-cortex-resolve-plugin)。

## 意外发现已经被包装成插件了

...好吧，张强同学已经把 gulp 的这个执行任务包装成过 webpack 插件了，在 webpack run 之前会先把 neuron 里面的结构转化到 node_modules 里面。我得比较一下我和他的利弊。

## tip

这里开发 webpack 的插件以及 loader 的时候，发现了一种好用的 debug 的方法，因为这个命令是命令行 webpack 执行的。用下面的 nodejs 以及 webstorm 的断点可以进行 debug。

```javascript
var path = require("path");
require("child_process").exec("npm config get prefix", function(err, stdout, stderr) {
  var nixLib = process.platform.indexOf("win") === 0 ? "" : "lib"; // win/*nix support

  var webpackPath = path.resolve(
    path.join(stdout.replace("\n", ""), nixLib, "node_modules", "webpack", "bin", "webpack.js")
  );
  require(webpackPath);
});
```
