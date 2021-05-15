export const ALL_MODE = ['L', 'C', 'S', 'R', 'temp', 'check']

export const ALL_FIELDS = [
  'type', 'name', 'size', 'count', 'total', 'unit', 'price', 'sum', 'weight',
  'freightCount', 'freightUnit', 'freight', 'mixPrice', 'mixSum', 'comments'
]

export const MODE_FIELDS_MAP = {
  'S': {
    fields: ['product', 'count', 'price', 'unit', 'total', 'sum', 'weight'],
    icon: 'icontubiaozhizuomoban',
  },
  'L': {
    fields: ['product', 'count', 'unit', 'total', 'weight'],
    icon: 'iconzulinshijian',
  },
  'C': {
    fields: ['product', 'compensationType', 'count', 'unit', 'total'],
    icon: 'iconpeichangjisuan',
  },
  // 可以做成关联实际吨位来计算，但是这部分可以录入的时候使用计算器直接按出来
  'R': {
    fields: ['product', 'count', 'unit', 'total'],
    icon: 'iconweixiu',
  },
  'temp': {
    fields: ['product', 'count', 'unit', 'total', 'weight'],
    icon: 'iconzancun',
  },
  'check': {
    fields: ['product', 'count', 'unit', 'total', 'weight'],
    icon: 'iconpandian',
  }
}

export const DEFAULT_ORDER_CATEGORY = '租赁出库'

const config = {
  '采购入库': {
    defaultMode: 'S',
    modes: ['S'],
  },
  '销售出库': {
    defaultMode: 'S',
    modes: ['S'],
  },
  '租赁入库': {
    defaultMode: 'L',
    modes: ['L', 'S', 'C', 'R'],
  },
  '租赁出库': {
    defaultMode: 'L',
    modes: ['L', 'S', 'C', 'R'],
  },
  '暂存入库': {
    defaultMode: 'temp',
    modes: ['temp'],
  },
  '暂存出库': {
    defaultMode: 'temp',
    modes: ['temp'],
  },
  '盘点入库': {
    defaultMode: 'check',
    modes: ['check'],
  },
  '盘点出库': {
    defaultMode: 'check',
    modes: ['check'],
  },
}
export default config