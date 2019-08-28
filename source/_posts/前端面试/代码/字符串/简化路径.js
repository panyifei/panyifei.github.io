/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function (path) {
  const arr = path.split('/');
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '.' || arr[i] === '') {
      arr.splice(i, 1);
      i--;
    }
    if (arr[i] === '..') {
      if (arr[i - 1]) {
        arr.splice(i - 1, 2);
        i--;
      } else {
        arr.splice(i, 1);
      }
      i--;
    }
  }
  return '/' + arr.join('/');
};