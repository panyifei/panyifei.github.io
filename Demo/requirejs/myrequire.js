//allModule用来保存所有加载的模块
var allModule = {};
//主要的define方法
function _registerModule(id,dependence,father){
    if(!allModule[id]){
        allModule[id]={};
        allModule[id].id = id;
        allModule[id].func = undefined;
        allModule[id].dependence = dependence;
        allModule[id].dependenceLoadNum = 0;
        allModule[id].finishLoad = function(){};
        if(father){
            if(allModule[id].referrer){
                allModule[id].referrer.push(father);
            }else{
                allModule[id].referrer = [];
                allModule[id].referrer.push(father);
            }
        }
    }else{
        if(father){
            allModule[id].referrer.push(father);
        }
        if(dependence){
            allModule[id].dependence = dependence;
            allModule[id].dependenceLoadNum = 0;
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

    var length = array.length;
    if(length > 0){
        array.forEach(function(value,index,array){
            var tempScript = document.createElement('script');
            tempScript.src = array[index]+'.js';
            document.body.appendChild(tempScript);
        })
        allModule[id].finishLoad = finish;
        function finish(){
            allModule[id].dependenceLoadNum++;
            if(allModule[id].dependenceLoadNum == allModule[id].dependence.length){
                var modules =[];
                for(var x = 0 ; x<array.length;x++){
                    modules[x] = allModule[array[x]].func;
                }
                allModule[id].func = cb.apply(null ,modules);
            }
            if(allModule[id].referrer){
                allModule[id].referrer.forEach(function(value,index,array){
                    allModule[array[index]].finishLoad();
                });
            }
        }
    }else{
        allModule[id].func = cb();
        if(allModule[id].referrer){
            allModule[id].referrer.forEach(function(value,index,array){
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
