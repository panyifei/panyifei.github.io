# hashchange事件

这里承接history相关，对于后退键不刷新页面，使用了修改hash来模拟实现的方法。

`hashchange`其实就是一个window的事件，在页面的hash被修改时会被触发。下面直接根据代码讲解吧。

```javascript
popPage.init = function(iScroll,options){
    var self = this;
    location.hash = '';
    self.showFlag = false;
    self.parentEl = $('<div class="pop-page"><div class="user-control" id="user-control"></div></div>');
    window.addEventListener('hashchange',function(event){
        event.preventDefault();
        if(location.hash == "#poppage"){
            //前进键打开(ios)，直接清hash
            if(!self.showFlag){
                location.hash = '';
                return;
            }
            self.showFlag = false;
            //body设置overflow可能会滚到到头部，先保存
            self.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            //安卓需要给body和html都加上才会锁住
            $('html').addClass('fix-scroll');
            $('body').addClass('fix-scroll');
            //小的兼容问题，不设置的页面有几率不回到顶部
            document.documentElement.scrollTop = document.body.scrollTop = 0;
            $('body').append(self.parentEl);
            //android2.3 bug，不加setTimeout初始化iSroll失败
            setTimeout(function(){
                //class改变得在setTimeout里面
                //animation   android2.3部分支持，测试无效，最后使用了transction
                self.parentEl.addClass('from-right');
                //判断iScroll是否传入
                if(iScroll!=undefined){
                    var options = options || {click:true};
                    new iScroll(document.getElementById('user-control'),options);
                }
            },0);
        }else{
            //还原，清空
            $('html').removeClass('fix-scroll');
            $('body').removeClass('fix-scroll');
            self.el().empty();
            self.parentEl.remove().removeClass('from-right');
            document.documentElement.scrollTop = self.scrollTop;
            document.body.scrollTop = self.scrollTop;
        }
    });
};
```

- 阻止了页面默认行为，页面的滚动自己来控制，不会有烦人的兼容

- 切换hash触发window的hashchange事件

- body元素固定住，不让他滚动，原页面最小影响

- 手机浏览器哪怕body设置了`overflow`也是可以滚动的，解决方式是给`html`也加上`overflow`

- 使用`overflow`有个坑，安卓2.3不支持这个属性，所以想做的话，从外部传进一个iscroll

- 外部传入iscroll，为了兼容，我传入了元素`document.getElementById('user-control')`

- iscroll对于新生成的元素需要写在settimeout里面

- 动画选择使用transction，animation在安卓2.3支持不好

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

这里是生成的页面，然后还提供了一个close方法，可供外界关闭这个新页面，这里的close用`setTimeout`包住了，不然会有异步的问题。还提供了一个可以得到内部元素的指针。

还得配合以下的css一起使用

```css
.pop-page{
    background-color: #fff;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: scroll;
    margin:0px -20px 0px 20px;
    opacity: 0.9;
    transition:all 0.5s;
    -moz-transition:all 0.5s; /* Firefox 4 */
    -webkit-transition:all 0.5s; /* Safari and Chrome */
    -o-transition:all 0.5s; /* Opera */
}
.from-right{
    margin:0px 0px 0px 0px;
    opacity: 1;
}
.fix-scroll{
    position: absolute;
    width: 100%;
    height:100%;
    overflow:hidden; 
}
.user-control{
    position: relative;
    background-color: #fff;
    width: 100%;
    height: 100%;
}
```

## 总结
踩了无数的android2.3的坑。包括动画，overflow。

后退时将新页面销毁了，因为这样比较安全。

意味着前进键回不去了，不是做不到支持前进键，而是不安全。

这个模块在勐喆的帮助下修改了很多次，逐渐变得越来越抽象，而且对原页面无痛。支持情况很好。