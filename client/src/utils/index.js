import $ from 'jquery'
import fuzzysearch from 'fuzzysearch'
import moment from 'moment'
import { flowRight, last, dropRight } from 'lodash'

import * as validator from './validator'

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
export function ajax(url, settings) {
  return $.ajax(url, settings).catch(res => {
    if (res.status === 401) {
      window.location.href = '#/login';
    }
    // 无论如何总是抛出，以便于后面的 catch 可以捕捉
    throw res;
  });
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
  const typeNameMap = {}
  const nameArticleMap = {}
  const names = {}
  articles.forEach(article => {
    if (!typeNameMap[article.type]) {
      typeNameMap[article.type] = []
    }
    if (names[article.name]) {
      names[article.name].sizes.push(article.size)
    } else {
      names[article.name] = article
      typeNameMap[article.type].push(article.name)
      nameArticleMap[article.name] = article
      article.sizes = [article.size]
    }
  })

  return {
    typeNameMap,
    nameArticleMap
  }
}

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

const PROJECT_TYPE_SET = new Set(['基地仓库', '同行客户', '项目仓库'])
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
const VENDOR_TYPE_SET = new Set(['基地仓库', '同行客户', '项目仓库', '供应商'])
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
