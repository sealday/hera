系统中权限暂时分成两级，一个是超级管理员，另一个是普通操作员（未完全实现）

操作员的权限相当高，能操作一个项目所有的事情

因此在这个基础上，我对总部对应的项目做特殊处理，总部对应的项目操作员，能够操作所有的来往记录
而其他项目的操作员，只能管理自己项目的内容（未实现）

所有调度、采购、销售都录入同一个表，即库存（未实现）
但是有不同的标记，用来生成报表


## 页面分成两部分
- 管理页面，逐步过渡到从公司全局进行管理，初始的功能为分配操作员和项目元数据
- 项目页面，用来管理项目当前的进度情况，实时监测进度，管理出库入库情况