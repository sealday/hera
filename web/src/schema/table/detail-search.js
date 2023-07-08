
export default [
  {
    name: 'outDate',
    label: '日期',
    type: 'date',
  },
  {
    name: 'number',
    label: '单号',
    type: 'list',
    column: {
      link: v => `/record/${v}`,
      width: '100px',
    },
  },
  {
    name: 'name',
    label: '产品',
    type: 'text',
  },
  {
    name: 'size',
    label: '规格',
    type: 'text',
  },
  {
    name: 'projectId',
    label: '仓库/项目',
    type: 'text',
    option: {
      type: 'ref',
      ref: 'project',
      label: 'name',
      value: '_id',
    },
  },
  {
    name: 'in',
    label: '入库数量',
    type: 'number',
  },
  {
    name: 'out',
    label: '出库数量',
    type: 'number',
  },
  {
    name: 'total',
    label: '小计',
    type: 'number',
    format: 'fixed',
  },
  {
    name: 'unit',
    label: '单位',
    type: 'text',
  },
]