---
layout: default
title: {{ site.name }}
---
# Chrome插件编写
Chrome的tab插件用的不爽，于是自己学习着写一个好了，[chrome的文档](https://developer.chrome.com/extensions/getstarted)很全面，自己的[插件地址](https://github.com/panyifei/chrome-tab-plugin)

## 编写
最重要的就是先新建一个`manifest.json`，要操作的主要就是这个json数据，申明了功能，以及资源的路径

然后用到的资源文件也只需要放在同一个目录下就可以了

然后就在chrome://extension里面自己安装一下就好了，这里需要开一下开发者模式

## mainfest内容
#### browserAction
这个东西是展示在地址栏右侧的小图标

与之对应的是`pageAction`，只争对单独的地址才会有所响应

- 设置default_icon来这个icon,还可以设置default_title,这个没啥用
- 还可以default_popup,这个可以在点击时弹出一个页面，页面的内容可以自己设置，html格式，如下，当然需要一个[popup.js](https://developer.chrome.com/extensions/examples/tutorials/getstarted/popup.js)

```json
{
  "manifest_version": 2,
  "name": "逸飞的小插件",
  "description": "This extension shows a Google Image search result for the current page",
  "version": "1.0",
  "browser_action": {
    "default_icon": "icon.png",
    "default_popup": "popup.html"
  },
  "permissions": [
    "activeTab",
    "https://ajax.googleapis.com/"
  ]
}
```

#### tab页面尝试
想要在点击插件时弹出新的页面，于是添加了background，并且去掉了popup相关的东西

```json
{
  "manifest_version": 2,
  "name": "逸飞的小插件",
  "description": "This extension shows a Google Image search result for the current page",
  "version": "1.0",
  "browser_action": {
    "default_icon": "icon.png"
  },
  "permissions": [
    "activeTab",
    "https://ajax.googleapis.com/"
  ],
  "background": {
    "scripts": ["eventPage.js"],
    "persistent": false
  }
}
```

然后eventPage里面就是简单的监听了一下点击,就可以实现点击访问那个页面了

```javascript
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {
        // Tab opened.
    });
});
```

#### chrome_url_overrides
这个属性添加进之后可以在打开`新标签页`和历史等的时候访问定好的页面

```json
{
  "chrome_url_overrides" : {
    "newtab": "popup.html"
}
```

这个页面的js和css都是直接可以写在项目中直接访问的,自己稍微完善了一下，已经很有feel了，哈哈~
