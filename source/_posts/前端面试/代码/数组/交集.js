// 算两个数组的交集

function cal(nums1, nums2) {
  let temp = {};
  const res = [];
  nums1.forEach(a => {
    if (temp[a]) {
      temp[a] += 1;
    } else {
      temp[a] = 1;
    }
  })
  nums2.forEach(a => {
    if (temp[a]) {
      temp[a] -= 1;
      res.push(a);
    }
  })
  return res;
}