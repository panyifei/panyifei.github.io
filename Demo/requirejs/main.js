//define('main',["a","b"],function (a,b) {
// a();
// b();
//});

//define('main',function (require, exports, module) {
//  require('a')()
//});

require(["a","b"],function (a,b) {
 a();
 b();
});