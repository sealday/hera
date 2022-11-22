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
]

export default settingSchema