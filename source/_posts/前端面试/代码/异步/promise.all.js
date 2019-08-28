// 写一个promise.all

function all(list) {
  let count = 0;
  let resValues = [];
  return new Promise((resolve, reject) => {
    list.forEach((p, i) => {
      Promise.resolve(p).then(res => {
        count++;
        resValues[i] = res;
        if (count === list.length) {
          resolve(resValues);
        }
      }, err => {
        reject(err);
      })
    })
  })
}
var p1 = Promise.resolve(1),
  p2 = Promise.resolve(2),
  p3 = Promise.resolve(3);
all([p1, p2, p3]).then(function (value) {
  console.log(value)
})