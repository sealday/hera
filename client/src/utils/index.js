/**
 * Created by seal on 20/01/2017.
 */

import $ from 'jquery';
import fuzzysearch from 'fuzzysearch'
import { products, SCALE_BASED, SIZE_BASED } from './products'

const productsMap = {}
// 预处理数据
products.forEach(product => {
  productsMap[JSON.stringify({
    type: product.type,
    name: product.name,
    size: product.size
  })] = product
})

/**
 * 计算规格的数值表达
 * @param sizeStr
 * @returns {number}
 */
export function calculateSize(sizeStr) {
  if (!sizeStr) return 1 // 未定义、空等情况返回1
  let size = sizeStr.split(';').pop();
  if (isNaN(size)) {
    return 1;
  } else {
    return Number(size);
  }
}

/**
 * 计算重量
 * @param entry
 */
export function calWeight(entry) {
  const key = JSON.stringify({
    type: entry.type,
    name: entry.name,
    size: entry.size
  })
  if (productsMap[key]) {
    if (productsMap[key].weight_method === SCALE_BASED) {
      return productsMap[key].scale * entry.count * productsMap[key].weight
    } else if (productsMap[key].weight_method === SIZE_BASED) {
      return entry.count * productsMap[key].weight
    } else {
      return 0
    }
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
      location.href = 'login.html';
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
  return `${ name }|${ size }`
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

export const filterOption = (option, filter) => {
  return fuzzysearch(filter, option.pinyin) || fuzzysearch(filter, option.label)
}

let formatNumber_

if (Intl) {
  formatNumber_ = (number) => {
    return isNaN(number) ? '' : new Intl.NumberFormat().format(number)
  }
} else {
  formatNumber_ = number => number
}

export const formatNumber = formatNumber_

export const total = (count, size) => toFixedWithoutTrailingZero(count * calculateSize(size))

/**
 * 返回为数字的total，且传入的参数形式是对象，这个方法理应更经常使用
 */
export const total_ = ({count, size}) => count * calculateSize(size)

import * as validator from './validator'
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
