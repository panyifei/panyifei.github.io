var allModules = [];

//func为结果,cb为函数
function define(id,deps,cb){
    if(!allModules[id]){
        allModules[id] = {};
        allModules[id].defined = true;
        allModules[id].cb = cb;
        if(deps.length == 0){
            _justLoad(id);
        }else{
            var loadPros = [];
            deps.forEach(function(value){
                if(!allModules[value]){
                    allModules[value] = {};
                }
                var depsLoadPro = new Promise(function(resolve){
                    var script = document.createElement('script');
                    script.onload = function(){
                        resolve();
                    }
                    script.src = value + '.js';
                    document.body.appendChild(script);
                }).then(function(){
                    if(!!allModules[value].func){
                        return allModules[value].func;
                    }else{
                        return allModules[value].initPro;
                    }
                });
                loadPros.push(depsLoadPro);
            });
            allModules[id].loadPro = Promise.all(loadPros).then(function(values){
                allModules[id].func = cb.apply(null,values);
                return allModules[id].func;
            });
        }
    }else{
        if(!allModules[id].defined){
            allModules[id].defined = true;
            allModules[id].cb = cb;
            if(deps.length == 0){
                _justLoad(id);
            }else{
                var loadPros = getDepsPro(deps);
                allModules[id].initPro = Promise.all(loadPros).then(function(values){
                    allModules[id].func = cb.apply(null,values);
                    return allModules[id].func;
                });
            }
        }
    }
}

function _justLoad(id){
    allModules[id].loadPro = new Promise(function(resolve){
        resolve();
    }).then(function(){
        allModules[id].func = allModules[id].cb();
        return allModules[id].func;
    });
}

function getDepsPro(deps){
    var loadPros = [];
    deps.forEach(function(value){
        if(!allModules[value]){
            allModules[value] = {};
        }
        var depsLoadPro;
        if(!allModules[value].loadPro){
            depsLoadPro = new Promise(function(resolve){
                var script = document.createElement('script');
                script.onload = function(){
                    resolve();
                }
                script.src = value + '.js';
                document.body.appendChild(script);
            }).then(function(){
                return allModules[value].func;
            });
        }else{
            depsLoadPro =  allModules[value].loadPro;
        }

        loadPros.push(depsLoadPro);
    });
    return loadPros;
}

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