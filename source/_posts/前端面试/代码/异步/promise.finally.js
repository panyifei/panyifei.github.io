// 用p点resolve是希望cb如果是个promise，需要等他执行完再执行。

Promise.prototype.finally = function (cb) {
  const p = this.constructor;
  return this.then(
    value => p.resolve(cb()).then(() => {
      return value;
    }),
    error => p.resolve(cb()).then(() => {
      throw error;
    })
  )
};