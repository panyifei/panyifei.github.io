// 实现一个深度优先搜索算法（非递归）
function dfs(tree, name) {
  // 请在这里实现
}

var tree = {
  name: '中国',
  children: [{
      name: '北京',
      children: [{
          name: '朝阳群众'
        },
        {
          name: '海淀区'
        },
        {
          name: '昌平区'
        }
      ]
    },
    {
      name: '浙江省',
      children: [{
          name: '杭州市',
          code: '0571',
        },
        {
          name: '嘉兴市'
        },
        {
          name: '绍兴市'
        },
        {
          name: '宁波市'
        }
      ]
    }
  ]
};


function dfs(tree, name) {
  //  请在这里实现
  let temp = [];
  temp.push(tree);
  while (temp.length !== 0) {
    const now = temp[temp.length - 1];
    if (!now.__childrenVisited && now.children && now.children.length > 0) {
      now.__childrenVisited = true;
      temp = temp.concat(now.children);
    } else {
      temp.pop();
      if (now.name === name) {
        return now;
      }
    }
  }
}