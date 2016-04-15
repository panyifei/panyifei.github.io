define('b',['c'],function(c){
    c();
    return function(){
        console.log('我是b');
    };
});