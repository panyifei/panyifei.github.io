define('b1c',['c'],function(c){
    c();
    return function(){
        console.log('我是b1c');
    };
});