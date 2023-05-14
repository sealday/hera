export default [
  {
    name: 'outStock',
    label: '出库仓库',
    type: 'text',
  },
  {
    name: 'inStock',
    label: '入库仓库',
    type: 'text',
  },
  {
    name: 'username',
    label: '制单人',
    type: 'text',
  },
  {
    name: 'comments',
    label: '备注',
    type: 'text',
  },
  {
    name: 'originalOrder',
    label: '原始单号',
    type: 'text',
  },
  {
    name: 'number',
    label: '订单编号',
    type: 'text',
  },
  {
    name: 'carNumber',
    label: '车号',
    type: 'text',
  },
  {
    name: 'entries',
    label: '明细',
    type: 'form',
    form: [
      {
        name: 'type',
        label: '类别',
        type: 'text',
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
        name: 'count',
        label: '数量',
        type: 'number',
      },
      {
        name: 'countUnit',
        label: '计量单位',
        type: 'text',
      },
      {
        name: 'weight',
        label: '重量（吨）',
        type: 'number',
        format: 'fixed',
      },
      {
        name: 'subtotal',
        label: '小计',
        type: 'number',
        format: 'fixed',
      },
      {
        name: 'unit',
        label: '单位',
        type: 'text',
      },
      {
        name: 'comments',
        label: '备注',
        type: 'text',
      },
      {
        name: 'total',
        label: '小计',
        type: 'formula',
        formula: {
          type: 'number',
        },
      },
    ],
  },
  {
    name: 'realinfos',
    label: '过磅信息',
    type: 'form',
    form: [
      {
        name: 'productNameGroups',
        label: '产品分组',
        type: 'text',
      },

      {
        name: 'realWeight',
        label: '重量',
        type: 'number',
        format: 'fixed',
      },
      {
        name: 'unit',
        label: '单位',
        type: 'text',
      },
      {
        name: 'comments',
        label: '备注',
        type: 'text',
      },
    ],
  },
  {
    name: 'complements',
    label: '补充信息',
    type: 'list',
    schema: [
      {
        name: 'level',
        label: '层级',
        type: 'text',
        option: {
          type: 'static',
          labels: ['关联', '补充'],
          values: ['associated', 'unconnected'],
        },
      },
      {
        name: ['associate', 'type'],
        label: '关联类别',
        type: 'text',
      },
      {
        name: ['associate', 'name'],
        label: '关联名称',
        type: 'text',
      },
      {
        name: ['associate', 'size'],
        label: '关联规格',
        type: 'text',
      },
      {
        name: 'product',
        label: '项目',
        type: 'text',
        option: {
          type: 'ref',
          ref: 'other',
          label: 'name',
          value: 'id',
          select: 'cascader',
        },
      },
      {
        name: 'count',
        label: '数量',
        type: 'text',
      },
      {
        name: 'unit',
        label: '单位',
        type: 'text',
      },
      {
        name: 'comments',
        label: '备注',
        type: 'text',
      },
    ],
  },
  {
    name: 'additionals',
    label: '额外信息',
    type: 'list',
    schema: [
      {
        name: 'content',
        label: '摘要',
        type: 'text',
      },
      {
        name: 'product',
        label: '计费项目',
        type: 'text',
        option: {
          type: 'ref',
          ref: 'other',
          label: 'name',
          value: 'id',
          select: 'cascader',
        },
      },
      {
        name: 'amount',
        label: '金额（元）',
        type: 'text',
      },
      {
        name: 'comments',
        label: '备注',
        type: 'text',
      },
    ],
  },
  {
    name: 'outDate',
    label: '出库时间',
    type: 'date',
  },
  {
    name: 'hasTransport',
    label: '是否关联运输单',
    type: 'boolean',
  },
  {
    name: 'type',
    label: '单据类别',
    type: 'text',
  },
  {
    name: 'status',
    label: '状态',
    type: 'option',
    option: [
      {
        label: '在用',
        value: 'enabled',
      },
      {
        label: '已删除',
        value: 'deleted',
      },
    ],
  },
  // 运输单部分
  {
    name: 'transport',
    label: '运输单',
    type: 'object',
    object: [
      {
        name: 'off-date',
        label: '出发日期',
        type: 'date',
      },
      {
        name: 'arrival-date',
        label: '到达日期',
        type: 'date',
      },
      {
        name: 'weight',
        label: '重量',
        type: 'text',
      },
      {
        name: 'price',
        label: '单价',
        type: 'text',
      },
      {
        name: 'extraPrice',
        label: '附加价格',
        type: 'text',
      },
      {
        name: 'payer',
        label: '付款方',
        type: 'text',
      },
      {
        name: 'payDate',
        label: '付款日期',
        type: 'text',
      },
      {
        name: 'pay-info',
        label: '付款信息',
        type: 'text',
      },
      {
        name: 'payee',
        label: '收款人',
        type: 'text',
      },
      {
        name: 'bank',
        label: '收款人开户行',
        type: 'text',
      },
      {
        name: 'account',
        label: '收款人账号',
        type: 'text',
      },
      {
        name: 'delivery-party',
        label: '发货方单位',
        type: 'text',
      },
      {
        name: 'delivery-contact',
        label: '发货方联系人',
        type: 'text',
      },
      {
        name: 'delivery-phone',
        label: '发货方电话',
        type: 'text',
      },
      {
        name: 'delivery-address',
        label: '发货方地址',
        type: 'text',
      },
      {
        name: 'receiving-party',
        label: '收货方单位',
        type: 'text',
      },
      {
        name: 'receiving-contact',
        label: '收货方联系人',
        type: 'text',
      },
      {
        name: 'receiving-phone',
        label: '收货方电话',
        type: 'text',
      },
      {
        name: 'receiving-address',
        label: '收货方地址',
        type: 'text',
      },
      {
        name: 'carrier-party',
        label: '收货方单位',
        type: 'text',
      },
      {
        name: 'carrier-contact',
        label: '收货方联系人',
        type: 'text',
      },
      {
        name: 'carrier-phone',
        label: '收货方电话',
        type: 'text',
      },
      {
        name: 'carrier-address',
        label: '收货方地址',
        type: 'text',
      },
      {
        name: 'carrier-car',
        label: '车牌号',
        type: 'text',
      },
    ],
  },
]