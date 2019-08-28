// 迭代方式实现flatten

function flatten (arr) {
  const res = []
  let temp = arr
  while(temp.length !== 0) {
    const a = temp.shift()
    if (Array.isArray(a)) {
      const newArr = []
      a.forEach(d => {
        newArr.push(d)
      })
      temp = newArr.concat(temp)
    } else {
      res.push(a)
    }
  }
  return res
}

arr.join(',').split(',').map(item => Number(item))

flatten([1, [2, [3, [4]], 5]])
