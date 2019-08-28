// 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

function bubble(nums) {
  let j = nums.length - 1;

  function helper(target) {
    if (target >= j) return;
    if (nums[target] !== 0) {
      helper(target + 1);
    } else {
      nums.splice(target, 1);
      nums.push(0);
      j--;
      helper(target);
    }
  }
  helper(0);
  return nums;
}