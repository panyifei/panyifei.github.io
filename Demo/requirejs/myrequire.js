//allModule用来保存所有加载的模块
var allModule = {};
//主要的define方法
function _registerModule(id,dependence,father){
    if(!allModule[id]){
        allModule[id]= {};
        var newModule = allModule[id];
        newModule.func = undefined;
        newModule.dependence = dependence;
        newModule.dependenceLoadNum = 0;
        newModule.finishLoad = function(){};
        if(father){
            if(newModule.referrer){
                newModule.referrer.push(father);
            }else{
                newModule.referrer = [];
                newModule.referrer.push(father);
            }
        }
    }else{
        var newModule = allModule[id];
        if(father){
            newModule.referrer.push(father);
        }
        if(dependence){
            newModule.dependence = dependence;
            newModule.dependenceLoadNum = 0;
        }
    }
}

//cb为加载完了执行的方法
//func为执行完了的方法
var define = function(id,array,cb){
    _registerModule(id,array,'',cb);
    array.forEach(function(value,index,array){
        _registerModule(array[index],[],id,cb);
    });
    var thisModule = allModule[id];
    if(array.length > 0){
        array.forEach(function(value,index,array){
            var tempScript = document.createElement('script');
            tempScript.src = array[index]+'.js';
            document.body.appendChild(tempScript);
        })
        thisModule.finishLoad = _finish;
    }else{
        thisModule.func = cb();
        _refererFinish();
    }
    function _finish(){
        thisModule.dependenceLoadNum++;
        if(thisModule.dependenceLoadNum == thisModule.dependence.length){
            var modules =[];
            for(var x = 0 ; x < array.length; x++){
                modules[x] = allModule[array[x]].func;
            }
            thisModule.func = cb.apply(null ,modules);
        }
        _refererFinish();
    }
    function _refererFinish(){
        if(thisModule.referrer){
            thisModule.referrer.forEach(function(value,index,array){
                allModule[array[index]].finishLoad();
            });
        }
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
