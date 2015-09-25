# hashchange事件

这里承接history相关，对于后退键不刷新页面，使用了修改hash来模拟实现的方法。

`hashchange`其实就是一个window的事件，在页面的hash被修改时会被触发。下面直接根据代码讲解吧。

```javascript

    var $ = require('zepto');
    var popPage = {};
    popPage.init = function(){
        var self = this;
        location.hash = '';
        self.showFlag = false;
        self.parentEl = $('<div class="pop-page"><div class="user-control"></div></div>');
        window.addEventListener('hashchange',function(event){
            event.preventDefault();
            if(location.hash == "#poppage"){
                //如果是从前进键打开的，直接清hash
                if(!self.showFlag){
                    location.hash = '';
                    return;
                }
                self.showFlag = false;
                document.documentElement.scrollTop = document.body.scrollTop =0;
                $('body').append(self.parentEl);
                $('body').addClass('fix-scroll');
            }else{
                $('body').removeClass('fix-scroll');
                self.el().empty();
                self.parentEl.remove();
            }
        });
    };
```

- 注意这里我阻止了页面默认行为，然后手动滚到了顶部

- 把body元素固定住，不让他滚动，这是对原页面最小影响的做法了

```javascript
    popPage.newPage = function(){
        var self = this;
        self.showFlag = true;
        //这样来触发hashchange方法
        location.hash = "#poppage";
        return self.el();
    };
    popPage.el = function(){
        var self = this;
        return self.parentEl.children('.user-control');
    }
    popPage.close = function(){
        var self = this;
        //这里加了个setTimeout，就可以直接清除了
        setTimeout(function(){
            if(location.hash == "#poppage"){
                history.go(-1);  
            }else{
                console.log('还未添加页面');
            }    
        },0);
    }
    module.exports = popPage;
```

这里是生成的页面，然后还提供了一个close方法，可供外界关闭这个新页面，还提供了一个可以得到内部元素的指针。

还得配合以下的css一起使用
```css

    .pop-page{
        background-color: #fff;
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: scroll;
    }
    .fix-scroll{
        overflow:hidden; 
    }
    .user-control{
        position: relative;
        background-color: #fff;
        width: 100%;
        height: 100%;
    }
    .test{
        position: relative;
        background-color: #fff;
        width: 100%;
        height: 1000px;
    }
```

## 总结
这里是后退时将新页面销毁了，因为这样比较安全。但是这就意味着前进键回不去了，不是做不到支持前进键，而是不安全。
这个模块在勐喆的帮助下修改了很多次，逐渐变得越来越抽象，而且对原页面无痛。支持情况很好，参见Caniuse网页。