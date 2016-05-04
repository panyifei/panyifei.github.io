# Webpack
## 新一代的前端构建工具
好吧，gulp感觉还没用多久呢，怎么Webpack又突然火了呢..

## 使用初步小结
初次使用是配合react,对于less文件也可以进行require操作而进行打包感觉非常奇特，只需要在配置文件定好的entry中require需要的less文件，然后再配置文件的module的写一个loader：`style-loader!css-loader!less-loader`就可以了。

## less-loader的小bug
居然right: -1px\0;这种语法回报错误！！
