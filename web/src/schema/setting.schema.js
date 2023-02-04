const settingSchema = [
  {
    label: '系统名称',
    name: 'systemName',
    type: 'text',
  },
  {
    label: '对外公司名称',
    name: 'externalNames',
    type: 'tags',
  },
  {
    label: '财务签收地址',
    name: 'address',
    type: 'text',
  },
  {
    label: '运输单打印侧边说明',
    name: 'printSideComment',
    type: 'text',
  },
  {
    label: '出入库单打印侧边说明',
    name: 'orderPrintSideComment',
    type: 'text',
  },
  {
    label: '职务列表',
    name: 'posts',
    type: 'tags',
  },
  {
    name: 'receiptUsers',
    label: '回单联指定操作员',
    type: 'tags',
    option: {
      type: 'ref',
      ref: 'user',
      label: 'username',
      value: 'username',
    },
  },
  {
    name: 'receiptTimeout',
    label: '第几天未签收提醒',
    type: 'number',
    min: 0,
  },
  {
    name: 'counterfoilUsers',
    label: '存根联指定操作员',
    type: 'tags',
    option: {
      type: 'ref',
      ref: 'user',
      label: 'username',
      value: 'username',
    },
  },
  {
    name: 'counterfoilTimeout',
    label: '第几天未签收提醒',
    type: 'number',
    min: 0,
  },
]

export default settingSchema