---
layout: default
title: {{ site.name }}
---
# Webpack插件编写
之前的项目因为使用了cortex的包(一种类似于npm的仓库，但是结构不同，有自己的cortex.json以及导出结构)，之前的构建流是使用了cortex的工具cortex build。但是现在项目迁为react+webpack。这个环境不支持cortex的包。于是张强同学写了个gulp的插件来将cortex的包转换成npm的模块。于是项目里面就出现了既有webpack，又有gulp，以及cortex的局面，所以我想要将gulp去除掉。

## 思考
想要让webpack识别cortex的包结构，得改变webpack的resolver。这个可以用webpack的插件来做。然后webpack读取到了资源之后，可以在loader里面对资源进行一定的处理，对于内部require的进行识别。

## webpack plugin
其实就是很简单，让他识别cortex的目录，然后doResolve
```javascript
var path = require('path');
//里面有一个方法来读取semver的版本的
var util = require('./util');
var fs = require('fs');
var MyConventionResolver = {
    apply: function(compiler) {
        compiler.plugin('module', function(request, callback) {
            if (request.request.indexOf('@cortex') === 0) {
                var pkg_name = request.request.substr(8);
                var cortex_json_file = path.resolve(__dirname, '../cortex.json');
                var cortex_config=JSON.parse(fs.readFileSync(cortex_json_file));
                var pkg_path = path.resolve(__dirname, '../neurons/', request.request.substr(8));
                var versions = fs.readdirSync(pkg_path);
                var ver = util.chooseCorrectVersion(cortex_config, versions, pkg_name, false , pkg_path);
                var newRequest = {
                    path: path.resolve(__dirname, '..' ),
                    request: 'neurons/' + pkg_name + '/' + ver + '/'+ pkg_name +'.js',
                    query: request.query,
                    directory: request.directory
                };
                this.doResolve(['file'], newRequest, callback);
            } else {
                callback();
            }
        });
    }
};
module.exports = MyConventionResolver;
```
webpack里面的配置
```
new webpack.ResolverPlugin([CortexPlugin])
```

## loader
其实就是对source进行处理，将包装过的结构进行还原
```javascript
module.exports = function (source) {
    if(source.indexOf('define(_') != -1){
        //处理js
        var newSource = util.processJS(source);
        return newSource;
    }else{
        return source;
    }
}
```
webpack里面的配置
```
resolveLoader: {
   alias: {
       "cortex-loader": path.join(__dirname, 'lib', "./cortex-loader")
   }
}
```

## 总结
这里只是记载了问题的整体解决过程，具体代码可以看我的两个模块[webpack-cortex-loader](https://github.com/panyifei/webpack-cortex-loader)和[webpack-cortex-resolve-plugin](https://github.com/panyifei/webpack-cortex-resolve-plugin)。

## tip
这里开发webpack的插件以及loader的时候，发现了一种好用的debug的方法，因为这个命令是命令行webpack执行的。用下面的nodejs以及webstorm的断点可以进行debug。
```javascript
var path = require('path');
require('child_process').exec("npm config get prefix", function(err, stdout, stderr) {
    var nixLib = (process.platform.indexOf("win") === 0) ? "" : "lib"; // win/*nix support

    var webpackPath = path.resolve(path.join(stdout.replace("\n", ""), nixLib, 'node_modules', 'webpack', 'bin', 'webpack.js'));
    require(webpackPath);
});
```
