define('b',['d'],function(d){
    d();
    return function(){
        console.log('我是b');
    };
});