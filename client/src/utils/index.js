/**
 * Created by seal on 20/01/2017.
 */

import $ from 'jquery';
import fuzzysearch from 'fuzzysearch'
import moment from 'moment'

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
      window.location.href = 'login.html';
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

const PROJECT_TYPE_SET = new Set(['基地仓库', '第三方仓库', '项目部仓库'])
/**
 * 筛选仓库列表
 * @param projects
 * @returns {*}
 */
export const getProjects = projects => {
  return projects.filter(project => PROJECT_TYPE_SET.has(project.type))
}

/**
 * 筛选供应商列表
 * @param projects
 * @returns {*}
 */
export const getVendors = projects => {
  return projects.filter(project => project.type === '供应商')
}


