import axios from 'axios'
import fuzzysearch from 'fuzzysearch'
import moment from 'moment'
import { flowRight, last, dropRight } from 'lodash'
import { saveAs } from 'file-saver'

import * as validator from './validator'
import { history, BASENAME } from '../globals'

/**
 * 计算规格的数值表达
 * @param product
 * @returns {number}
 */
export const getScale = (product) => {
  return product.isScaled ? product.scale : 1
}

/**
 * 计算重量
 * @param entry
 * @param products
 */
export function calWeight(entry, products) {
  const product = products[makeKeyFromNameSize(entry.name, entry.size)]
  if (product) {
    return product.weight * entry.count
  } else {
    return 0
  }
}

/**
 * 最多保留两位，但是移除小数点后面的零
 * @param num
 * @param last 保留几位
 * @returns {string}
 */
export function toFixedWithoutTrailingZero(num, last) {
  const lead = last || 2
  return Number(Number(num).toFixed(lead)).toString();
}

/**
 * 生成短 id
 * TODO 如果实际中得到许可，我们将把这个 id 存到数据库中，避免每次重新计算
 * @param id
 * @returns {string}
 */
export function getShortOrder(id) {
  return Number.parseInt(id.slice(4, 8), 16) + '-' + Number.parseInt(id.slice(22, 24), 16)
}

/**
 * 简单封装的 ajax 请求，目的是为了增加我们自己的请求中间件
 * @param url 请求路径
 * @param settings 请求设置
 */
export async function ajax(url, settings = {}) {
  try {
    if (settings.method === 'POST' && settings.data) {
      settings.data = JSON.parse(settings.data)
    } else if (settings.data) {
      settings.params = settings.data
    }
    const res = await axios({ url, ...settings })
    return res.data
  } catch (err) {
    if (err.response.status === 401) {
      // FIXME 怎么阻止后续的操作？现在如果不抛出异常，对应请求后续会当做是是正常请求从而导致不正确的行为
      // 但是目前总是抛出异常的方法，后续请求没有处理，会导致调试时页面出错
      history.push(BASENAME + '/login')
    }
    throw err
  }
}

/**
 * name|size 的形式作为键值对
 * @param name
 * @param size
 * @returns {*}
 */
export function makeKeyFromNameSize(name, size) {
  return `${ name }|${ typeof size === 'undefined' ? '' : size }`
}

export const updateEntry = (record, products) => {
  record.entries.forEach((entry) => {
    entry.number = products[makeKeyFromNameSize(entry.name, entry.size)].number
  })
}

/**
 * 产品类型从数组转换成 map 形式，方便查找
 * @param articles
 * @returns
 */
export function transformArticle(articles) {
  const products = articles
  const typeNameMap = {}
  const nameArticleMap = {}
  const names = {}
  products.forEach(article => {
    if (!typeNameMap[article.type]) {
      typeNameMap[article.type] = []
    }
    if (names[article.name]) {
      names[article.name].sizes.push(article.size)
    } else {
      names[article.name] = { ...article }
      typeNameMap[article.type].push(article.name)
      nameArticleMap[article.name] = names[article.name]
      names[article.name].sizes = [article.size]
    }
  })

  return {
    typeNameMap,
    nameArticleMap
  }
}

/**
 * root: {
 *   value: 'root',
 *   label: 'root',
 *   children: [
 *     {
 *       value: '租赁类',
 *       label: '租赁类',
 *       children: [
 *         {
 *           value: '钢管',
 *           label: '钢管',
 *           children: [
 *             {
 *                value: "0.1",
 *                label: "0.1"
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 * @param {*} products 
 */
export function buildProductTree(products, keepSize=true) {
  const root = {
    value: 'root',
    label: 'root',
    children: []
  }
  const remind = {}
  products.forEach(product => {
    // 类型
    if (!(product.type in remind)) {
      remind[product.type] = root.children.length
      root
        .children.push({
          value: product.type,
          label: product.type,
          children: [],
        })
    }
    // 名称
    if (!(`${product.name}@${product.type}` in remind)) {
      remind[`${product.name}@${product.type}`]
        = root.children[remind[product.type]].children.length
      const child = {
        value: product.name,
        label: product.name,
      }
      if (keepSize) {
        child.children = []
      }
      root
        .children[remind[product.type]]
        .children.push(child)
    }
    if (keepSize) {
      // 规格
      root
        .children[remind[product.type]]
        .children[remind[`${product.name}@${product.type}`]]
        .children.push({
          value: product.size,
          label: product.size,
        })
    }
  })
  return root
}

/**
 * 
 * @param {*} products 
 * @returns 
 */
export const oldProductStructure = (products) => {
  const names = {}
  const results = []
  products.forEach((product) => {
    if (!names[product.name]) {
      names[product.name] = product
      results.push(product)
      product.sizes = []
    }
    names[product.name].sizes.push(product.size)
  })
  return results
}

/**
 * 获取产品的单位
 * @param product
 * @returns {string}
 */
export const getUnit = (product) => {
  return product.isScaled ? product.unit : product.countUnit
}

export const parseMode = mode => {
  const names = {
    L: '租赁',
    S: '销售',
    C: '赔偿',
    R: '服务',
  }
  return !mode || mode === 'L' ? '' : names[mode]
}

export const filterOption = (filter, option) => {
  return fuzzysearch(filter, option.props.pinyin) || fuzzysearch(filter, option.props.label)
}

let formatNumber_
let currencyFormat_
let numberFormat_
let percentFormat_

if (window.Intl) {
  formatNumber_ = (number) => {
    return isNaN(number) ? '' : new Intl.NumberFormat().format(number)
  }
  currencyFormat_ = (number, fractionDigits = 2) => {
    const options = { style: 'currency', currency: 'CNY', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
    const numberFormat = new Intl.NumberFormat('zh-CN', options)
    return number ? numberFormat.format(number) : numberFormat.format(0)
  }
  percentFormat_ = (number, fractionDigits = 2) => {
    const options = { style: 'percent', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
    const numberFormat = new Intl.NumberFormat('zh-CN', options)
    return number ? numberFormat.format(number) : numberFormat.format(0)
  }
  numberFormat_ = (number, fractionDigits = 2) => {
    const numberFormat = new Intl.NumberFormat('zh-CN', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })
    return numberFormat.format(number)
  }
} else {
  formatNumber_ = number => number
  currencyFormat_ = (number) => {
    return isNaN(number) ? '' : number
  }
  numberFormat_ = number => number
  percentFormat_ = number => number
}

export const formatNumber = formatNumber_
export const currencyFormat = currencyFormat_
export const numberFormat = numberFormat_
export const percentFormat = percentFormat_
export const dateFormat = date => moment(date).format('YYYY-MM-DD')

export const total = (count, product) => toFixedWithoutTrailingZero(count * getScale(product))

/**
 * 返回为数字的total，且传入的参数形式是对象，这个方法理应更经常使用
 */
export const total_ = ({count, size, name}, products) => {
  const product = products[makeKeyFromNameSize(name, size)]
  if (product) {
    return count * getScale(products[makeKeyFromNameSize(name, size)])
  } else {
    return count;
  }
}

export { validator }

export const isUpdatable = (store, user) => {
  if (user.role === '系统管理员') {
    return true;
  }
  for (let i = 0; i < user.perms.length; i++) {
    const perm = user.perms[i]
    if (perm.projectId === store._id) {
      return perm.update;
    }
  }
  return false;
}

export const isInsertable = (store, user) => {
  if (user.role === '系统管理员') {
    return true;
  }
  for (let i = 0; i < user.perms.length; i++) {
    const perm = user.perms[i]
    if (perm.projectId === store._id) {
      return perm.insert;
    }
  }
  return false;
}

export { default as theme } from './theme'

const PROJECT_TYPE_SET = new Set(['基地仓库', '同行客户', '项目仓库', '租赁客户'])
/**
 * 筛选仓库列表
 * @param projects
 * @returns {*}
 */
export const getProjects = projects => projects.filter(project => PROJECT_TYPE_SET.has(project.type))

/**
 * 筛选供应商列表
 * @param projects
 * @returns {*}
 */
const VENDOR_TYPE_SET = new Set(['基地仓库', '同行客户', '项目仓库', '租赁客户', '供应商'])
export const getVendors = projects => projects.filter(project => VENDOR_TYPE_SET.has(project.type))


/**
 * 包装 HOC
 * @param fns
 * @returns {*}
 */
export const wrapper = (fns) => {
  if (fns.length < 2) {
    throw new Error('函数列表个数不得少于 2 个')
  }
  return flowRight(dropRight(fns))(last(fns))
}

/**
 * @param level 日志内部名称
 * @returns 日志对外名称
 */
export const getLevelName = level => {
  switch (level) {
    case 'INFO':
      return '提示'
    case 'DANGER':
      return '危险'
    default:
      return ''
  }
}

/**
 *
 * @param user 当前用户
 * @param roles 允许的角色
 * returns 是否允许
 */
export const isCurrentUserPermit = (user, roles) => {
  for (let i = 0; i < roles.length; i++) {
    if (user.role === roles[i]) {
      return true
    }
  }
  return false
}

/**
 * 支持仓库类型、客户类型
 */
export const TAB2TYPE = ['基地仓库', '项目仓库', '租赁客户', '同行客户', '供应商', '承运商']

/**
 * 默认仓库类型
 */
export const DEFAULT_STORE_TYPE = '项目仓库'

/**
 * 默认仓库类型索引
 */
export const DEFAULT_TAB_INDEX = TAB2TYPE.indexOf(DEFAULT_STORE_TYPE)

/**
 * 支持仓库类型
 */
export const STORE2TYPE = ['基地仓库', '项目仓库', '租赁客户', '同行客户']

/**
 * 支持合同仓库
 */
export const CONTRACT_TYPES = ['项目仓库', '租赁客户', '同行客户']

/**
 * 采购支持客户类型
 */
export const PURCHASING_CLIENT_TYPES = ['项目仓库', '租赁客户', '同行客户', '基地仓库', '供应商']

/**
 * 支持的订单类型
 */
export const RECORD_TYPES = ['购销', '调拨', '暂存', '盘点']

/**
 * 订单类型的路径映射
 */
export const RECORD_TYPE2URL_PART = { '调拨': 'transfer', '购销': 'purchase', '暂存': 'transfer_free' }

export const DEFAULT_QUERY_TYPE = '调拨'

export const PRINT_STYLE = `
body {
  font: 14px "微软雅黑", "Lucida Grande", Helvetica, Arial, sans-serif;
  color: black;
  padding: 0;
  margin: 1px;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: .5em;
  font-weight: 500;
}

table {
  border-collapse: collapse;
}

.table--tight>tbody>tr>td,
.table--tight>tbody>tr>th,
.table--tight>tfoot>tr>td,
.table--tight>tfoot>tr>th,
.table--tight>thead>tr>td,
.table--tight>thead>tr>th {
  padding: 1px;
}

.row-sum {
  font-weight: 900;
  text-decoration: underline;
}

.table-clean>tbody>tr>td,
.table-clean>tbody>tr>th,
.table-clean>tfoot>tr>td,
.table-clean>tfoot>tr>th,
.table-clean>thead>tr>td,
.table-clean>thead>tr>th {
  border-top: 1px solid white;
}

.table-bottom-border>tbody>tr>td,
.table-bottom-border>tbody>tr>th,
.table-bottom-border>tfoot>tr>td,
.table-bottom-border>tfoot>tr>th,
.table-bottom-border>thead>tr>td,
.table-bottom-border>thead>tr>th {
  border-bottom: 1px solid black;
}

.cell-left-border {
  border-left: 1px solid black;
}

.cell-right-border {
  border-right: 1px solid black;
}

.table-top-border>thead>tr>th {
  border-top: 1px solid black;
}

.table-top-border>thead:first-child>tr:first-child>th {
  border-top: 1px solid black;
}

/* 作为表单的表格样式 */
.form-table th,
.form-table td {
  padding-left: 2px;
  padding-right: 2px;
  text-align: center;
}

/* 运输单 */
.table__transport th {
  min-width: 5.5em;
}

.table__transport td {
  font-size: 11px;
}

.h-left-margin-1-em {
    margin-left: 1em;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.table-bordered>thead>tr>th,
.table-bordered>thead>tr>td,
.table-bordered>tbody>tr>th,
.table-bordered>tbody>tr>td {
	border: 1px solid black;
}
`
export const rentExcelExport = (XLSX, rent) => {
  const wb = XLSX.utils.book_new()

  const json = [[
    '日期', '出入库', '名称', '规格', '单位', '数量', '单价', '天数', '金额', '运费'
  ]]
  for (const item of rent.history) {
    json.push([
      '上期结存', null, item.name, '', item.unit,
      item.count, item.unitPrice || 0, item.days, item.price, 0
    ])
  }
  for (const item of rent.list) {
    json.push([
      dateFormat(item.outDate), item.inOut, item.name, item.size, item.unit,
      item.count, item.unitPrice || 0, item.days, item.price, item.freight || 0
    ])
  }
  const sheet = XLSX.utils.aoa_to_sheet(json)
  const range = XLSX.utils.decode_range(sheet['!ref'])

  // 数量 5
  // 单价 6
  // 金额 8
  // 运费 9
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let format
    switch (C) {
      case 5:
        format = '#,##0.00_ ;-#,##0.00'
        break
      case 6:
        format = '#,##0.0000_ '
        break
      case 8:
        format = '#,##0.00_ ;[red]-#,##0.00'
        break
      case 9:
        format = '#,##0.00_ ;-#,##0.00'
        break
      default:
        continue
    }
    for (let R = range.s.r; R <= range.e.r; ++R) {
      if (R === 0) continue
      const cell_address = { c: C, r: R }
      const cell_ref = XLSX.utils.encode_cell(cell_address)
      if (sheet[cell_ref]) {
        sheet[cell_ref] = XLSX.utils.cell_set_number_format(sheet[cell_ref], format)
      }
    }
  }
  XLSX.utils.book_append_sheet(wb, sheet, '租金计算表')
  const out = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary', compression: true })
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF
    }
    return buf
  }
  saveAs(new Blob([s2ab(out)], { type: "application/octet-stream" }), "租金计算表.xlsx")
}

export const enableFilters = [
  {
    'text': '在用',
    'value': 'enable'
  },
  {
    'text': '禁用',
    'value': 'disabled',
  },
]

export const shouldShow = (condition, view) => condition ? view : null

export { generateFormContent, genTableColumn  } from './antd'