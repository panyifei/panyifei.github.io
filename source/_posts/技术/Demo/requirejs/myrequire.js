//allModule用来保存所有加载的模块
var allModule = [];
function Module(id,dependence){
    this.func = undefined;
    this.id = id;
    this.dependence = dependence;
    this.dependenceLoadNum = 0;
    this.handlers = {};
}

Module.prototype={
    on: function(name,handler){
        if(!this.handlers[name]){
            this.handlers[name] = [];
            this.handlers[name].push(handler);
        }else{
            this.handlers[name].push(handler);
        }
    },
    emit:function(name){
        if(!!this.handlers[name]){
            this.handlers[name].forEach(function(value){
                value();
            })
        }
    }
}

function _registerModule(id,dependence,defined){
    var i  = allModule.length;
    if(!allModule[id]){
        allModule[i++] = allModule[id]= new Module(id,dependence);
        allModule[id].defined = defined;
    }else{
        if(dependence){
            allModule[id].dependence = dependence;
            allModule[id].dependenceLoadNum = 0;
        }
    }
    dependence.forEach(function(value){
        _registerModule(value,[],false);
    });
}

//cb为加载完了执行的方法
var define = function(id,array,cb){
    //注册相关的模块
    _registerModule(id,array,true);

    var thisModule = allModule[id];
    if(array.length > 0){
        array.forEach(function(value){
            allModule[value].on('finish',function(){
                _finish();
            })
            if(!(allModule[value].defined)){
                var tempScript = document.createElement('script');
                tempScript.src = value+'.js';
                document.body.appendChild(tempScript);
            }
        })
    }else{
        thisModule.func = cb();
        thisModule.emit('finish');
    }
    function _finish(){
        thisModule.dependenceLoadNum++;
        if(thisModule.dependenceLoadNum == thisModule.dependence.length){
            var modules =[];
            array.forEach(function(value,index){
                modules[index] = allModule[value].func;
            })
            thisModule.func = cb.apply(null ,modules);
            //继续向上层触发
            thisModule.emit('finish');
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
