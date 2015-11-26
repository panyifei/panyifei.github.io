# Angular
angular是个很好用的前端单页应用的框架，使用的双向数据绑定来控制显示。

## 设置directive触发enter键
jade为
        input.input(ng-model="searchInput" ng-enter="search()" placeholder="keyword:ajax|name:jquery|author:ltebean")
        
js为

```javascript
app.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
});
```

然后在$scope上面申明一个search方法，就可以在回车时触发了，赞！！

## ng-bind-html
这个是来在网站上显示html的，但是return的结果必须使用`$sce.trustAsHtml()`这个方法来包裹一下，等于就是确定这个是安全的。

