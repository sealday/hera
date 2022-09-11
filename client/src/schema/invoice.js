export default [
  {
    label: '发票类别',
    name: 'type',
    type: 'text',
    option: {
      type: 'static_value_only',
      values: ['增值税专用发票', '增值税普通发票']
    },
    required: true,
  },
  {
    label: '进销项发票',
    name: 'direction',
    type: 'text',
    option: {
      type: 'static_value_only',
      values: ['进项发票', '销项发票']
    },
    disabled: true,
    hidden: true,
  },
  {
    label: '开票日期',
    name: 'date',
    type: 'date',
    required: true,
  },
  {
    label: '发票号码',
    name: 'id',
    type: 'text',
    required: true,
  },
  {
    label: '销售方',
    name: 'sale',
    type: 'text',
    option: {
      type: 'ref',
      ref: 'company',
      label: 'name',
      value: '_id',
    }
  },
  {
    label: '购买方',
    name: 'purchase',
    type: 'text',
    option: {
      type: 'ref',
      ref: 'company',
      label: 'name',
      value: '_id',
    }
  },
  {
    label: '备注',
    name: 'comments',
    type: 'text',
    col: 'fullwidth',
  },
  {
    label: '明细',
    name: 'items',
    type: 'list',
    schema: [
      {
        label: '项目名称',
        name: 'projectId',
        type: 'text',
        option: {
          type: 'ref',
          ref: 'project',
          label: 'name',
          value: '_id',
        }
      },
      {
        label: '开票内容',
        name: 'content',
        type: 'text',
      },
      {
        label: '金额',
        name: 'amount',
        type: 'number',
        disabled: true,
        formula: '[total] / (1 + [taxRate])',
        watch: ['total', 'taxRate'],
      },
      {
        label: '发票税率',
        name: 'taxRate',
        type: 'number',
        option: {
          type: 'static',
          labels: ['1%', '3%', '6%', '9%', '13%'],
          values: [0.01, 0.03, 0.06, 0.09, 0.13],
        },
        default: 0.13,
      },
      {
        label: '税额',
        name: 'tax',
        type: 'number',
        formula: '[total] - [total] / (1 + [taxRate])',
        watch: ['total', 'taxRate'],
        disabled: true,
      },
      {
        label: '价税合计',
        name: 'total',
        type: 'number',
        default: 0,
      },
    ],
  }
]
