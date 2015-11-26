# Angular

## 触发enter键
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