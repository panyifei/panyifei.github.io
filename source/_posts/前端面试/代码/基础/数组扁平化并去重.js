// 已知如下数组：
// var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
// 编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

function cal(nums) {
  const res = [];
  helper(nums);

  function helper(arr) {
    arr.forEach(a => {
      if (Array.isArray(a)) {
        helper(a);
      } else {
        res.push(a);
      }
    });
  }
  res.sort((a, b) => a - b);
  return Array.from(new Set(res));
}

// arr.toString().split(',')
// arr.flat(Infinity); 