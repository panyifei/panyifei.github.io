function _new(fn, ...args) {
  const obj = {};
  obj.__proto__ = fn.prototype;
  const res = fn.call(obj, ...args);
  return res instanceof Object ? res : obj;
}