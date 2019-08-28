// proxy数据绑定

const data = {
  count: 1
};
new Proxy(data, {
  get: function (target, key) {
    return target[key];
  },
  set: function (target, key, value) {
    target[key] = value;
    render(value);
  }
})

function render(value) {
  document.getElementsByClassName('.count').innerHtml = value;
}