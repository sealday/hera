export default [
  {
    label: '编号',
    name: 'number',
    type: 'number',
    required: true,
  },
  {
    label: '类别',
    name: 'type',
    type: 'text',
    required: true,
  },
  {
    label: '名称',
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    label: '规格',
    name: 'size',
    type: 'text',
    required: true,
  },
  {
    label: '计量单位',
    name: 'countUnit',
    type: 'text',
    required: true,
  },
  {
    label: '理论重量',
    name: 'weight',
    type: 'number',
    suffix: '千克',
  },
  {
    label: '换算单位',
    name: 'unit',
    type: 'text',
  },
  {
    label: '换算比例',
    name: 'scale',
    type: 'number',
  },
  {
    label: '是否需要换算',
    name: 'isScaled',
    type: 'boolean',
  },
]
