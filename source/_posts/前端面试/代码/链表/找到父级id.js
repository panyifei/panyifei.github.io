const data = [{
  id: '1',
  name: 'test1',
  children: [
    {
      id: '11',
      name: 'test11',
      children: [
        {
          id: '111',
          name: 'test111'
        },
        {
          id: '112',
          name: 'test112'
        }
      ]

    },
    {
      id: '12',
      name: 'test12',
      children: [
        {
          id: '121',
          name: 'test121'
        },
        {
          id: '122',
          name: 'test122'
        }
      ]
    }
  ]
}]

function find (value) {
  let find = false
  const buffer = []
  let res = []
  check(data)
  function check (arr) {
    if (find) return
    arr.forEach(a => {
      if (a.id === value) {
        find = true
        buffer.push(a.id)
        res = buffer.slice()
      } else {
        if (a.children && a.children.length > 0) {
          buffer.push(a.id)
          check(a.children)
          buffer.pop()
        }
      }
    })
  }
  return res
}
