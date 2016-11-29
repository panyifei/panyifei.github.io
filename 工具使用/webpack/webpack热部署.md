---
layout: default
title: {{ site.name }}
---
# Webpack热部署
其实webpack的config好好配置了之后，热部署很简单

## 直接使用命令
首先`npm install webpack-dev-server --dev--save`，然后配置一些package.json的scripts为`"start": "node server.js"`。

然后新建一个server.js

```javascript
const child_process = require("child_process");
const open = require('open');
var ls = child_process.exec('node_modules/.bin/webpack-dev-server', {});
ls.stdout.on('data', function (data) {
    console.log(data);
});
ls.stderr.on('data', function (data) {
    console.log(data);
});
ls.on('exit', function (code) {
    console.log('child process exited with code ' + code);
});
open("http://localhost:8080/webpack-dev-server/");
```

## 直接使用官网的nodejs的配置
```javascript
'use strict';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const open = require('open');
const internalIP = require('internal-ip');
let config = require('./webpack.config.js');
const port = config.devServer.port;
const ip = '0.0.0.0';//internalIP.v4();
for (let key in config.entry) {
    let ar = config.entry[key];
    if (key != "common") {
        ar.unshift("webpack-dev-server/client?http://"+ip+":"+port+"/", "webpack/hot/dev-server");
    }
}
config.plugins = config.plugins || [];
config.plugins.push(new webpack.HotModuleReplacementPlugin());
new WebpackDevServer(webpack(config), config.devServer)
    .listen(port, ip, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Listening at localhost:' + port);
        console.log('Opening your system browser...');
        open('http://'+(internalIP.v4()||'127.0.0.1')+':' + port + '/webpack-dev-server/');
    });

```

config里面的是
```javascript
{
    devServer: {
       contentBase: './html',
       historyApiFallback: false,
       hot: true,
       port: 8088,
       publicPath: '/dest/',
       noInfo: false
   }
}
```

## 为什么热部署没有颜色，而webpack命令行有颜色
首先，命令行输出的颜色是标记式语言，webpack的输出有颜色肯定是使用了那些标记。而热部署的时候没有颜色肯定是他把标记去掉了，至于为什么要去掉，可能是考虑到会输出到文件，然后去掉了标记。
