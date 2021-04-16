const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '备注',
    key: 'comments',
    dataIndex: 'comments',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Action',
    key: 'action',
  }
];

for (let i in columns) {
    const column = columns[i];
    console.log(`<Table.Column title="${column.title}" key="${column.key}" dataIndex="${column.dataIndex}" />`)
}