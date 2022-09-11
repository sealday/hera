export default [
  {
    label: '名称',
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    label: '角色',
    name: 'role',
    type: 'text',
    option: {
      type: 'static_value_only',
      values: ['关联公司', '客户公司']
    },
    required: true,
  },
  {
    label: '纳税人识别号',
    name: 'tin',
    type: 'text',
    required: true,
  },
  {
    label: '纳税人类别',
    name: 'tc',
    type: 'text',
    option: {
      type: 'static_value_only',
      values: ['一般纳税人', '小规模纳税人']
    },
    required: true,
  },
  {
    label: '地址',
    name: 'addr',
    type: 'text',
    col: 'fullwidth',
  },
  {
    label: '电话',
    name: 'tel',
    type: 'text',
    col: 'fullwidth',
  },
  {
    label: '开户行',
    name: 'bank',
    type: 'text',
    col: 'fullwidth',
  },
  {
    label: '账号',
    name: 'account',
    type: 'text',
    col: 'fullwidth',
  },
  {
    label: '行号',
    name: 'code',
    type: 'text',
    col: 'fullwidth',
  },
]