let list = [{
    id: 1,
    name: '部门A',
    parentId: 0
  },
  {
    id: 2,
    name: '部门B',
    parentId: 0
  },
  {
    id: 3,
    name: '部门C',
    parentId: 1
  },
  {
    id: 4,
    name: '部门D',
    parentId: 1
  },
  {
    id: 5,
    name: '部门E',
    parentId: 2
  },
  {
    id: 6,
    name: '部门F',
    parentId: 3
  },
  {
    id: 7,
    name: '部门G',
    parentId: 2
  },
  {
    id: 8,
    name: '部门H',
    parentId: 4
  }
];

// 转换后的结果如下
let result = [{
  id: 1,
  name: '部门A',
  parentId: 0,
  children: [{
      id: 3,
      name: '部门C',
      parentId: 1,
      children: [{
        id: 6,
        name: '部门F',
        parentId: 3
      }, {
        id: 16,
        name: '部门L',
        parentId: 3
      }]
    },
    {
      id: 4,
      name: '部门D',
      parentId: 1,
      children: [{
        id: 8,
        name: '部门H',
        parentId: 4
      }]
    }
  ]
}];


function convert(list) {
  let res = [];
  const map = {};
  list.forEach(l => {
    map[l.id] = l;
  })
  list.forEach(l => {
    if (!l.parentId) {
      res.push(l);
    } else {
      const parent = map[l.parentId];
      if (parent.children) {
        parent.children.push(l);
      } else {
        parent.children = [l];
      }
    }
  })
  return res;
}

convert(list);