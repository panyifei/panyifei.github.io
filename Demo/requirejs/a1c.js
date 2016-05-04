define('a1c',['c'],function(c){
    c();
    return function(){
        console.log('我是a1c');
    };
});