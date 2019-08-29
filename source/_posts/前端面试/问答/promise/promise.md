## promise 的执行顺序

promise 构造函数同步执行，then 里面的 cb 是异步的，被放到了微任务里面。
