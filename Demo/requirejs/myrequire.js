//allModule用来保存所有加载的模块
var allModule = {};
//主要的define方法
var define = function(id,array,cb){
    var length = array.length;
    if(length > 0){
        var i = 0;
        array.forEach(function(value,index,array){
            var tempScript = document.createElement('script');
            tempScript.src = array[index]+'.js';
            //目前用的onload来监听加载完毕，但是如果有依赖的话，就不行了
            tempScript.onload = function(){
                i++;
                finish();
            }
            document.body.appendChild(tempScript);
        })
        function finish(){
            if(i == length){
                var modules =[];
                for(var x = 0 ; x<array.length;x++){
                    modules[x] = allModule[array[x]];
                }
                allModule[id] = cb.apply(null ,modules);
            }
        }
    }else{
        allModule[id] = cb();
    }
};

var scripts = document.getElementsByTagName('script');
var sLength = scripts.length;
var mainJs;
for(var i=0;i<sLength;i++){
    var name = scripts[i].getAttribute("data-main");
    if(name){
        mainJs = name;
    }
}
var mainScript = document.createElement('script');
mainScript.src = mainJs;
document.body.appendChild(mainScript);
