/**
 * Created by seal on 20/01/2017.
 */

import $ from 'jquery';
import pinyin from 'pinyin'
import fuzzysearch from 'fuzzysearch'

/**
 * 计算规格的数值表达
 * @param size
 * @returns {number}
 */
export function calculateSize(size) {
  let sizes = size.split(';');
  if (isNaN(sizes[sizes.length - 1])) {
    return 1;
  } else {
    return Number(sizes[sizes.length - 1]);
  }
}

/**
 * 最多保留两位，但是移除小数点后面的零
 * @param num
 * @returns {string}
 */
export function toFixedWithoutTrailingZero(num) {
  return Number(Number(num).toFixed(2)).toString();
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
 * 这个地方是为了处理 6.0 和 6 这样子两个没有区别的数字
 * 实际中似乎没有解决问题，但是后来没有重现问题
 * TODO 以 name + size 的形式作为键值对，有更好的方式么
 * @param name
 * @param size
 * @returns {*}
 */
export function makeKeyFromNameSize(name, size) {
  return isNaN(size) ? name + size : name + Number(size)
}

/**
 * 产品类型从数组转换成 map 形式，方便查找
 * @param articles
 * @returns {{typeNameMap: {租赁类: Array, 消耗类: Array, 工具类: Array}, nameArticleMap: {}}}
 */
export function transformArticle(articles) {
  let typeNameMap = {};
  let nameArticleMap = {};
  articles.forEach(article => {
    if (!typeNameMap[article.type]) {
      typeNameMap[article.type] = []
    }
    typeNameMap[article.type].push(article.name);
    nameArticleMap[article.name] = article;
  });

  return {
    typeNameMap,
    nameArticleMap
  };
}

export const filterOption = (option, filter) => {
  return fuzzysearch(filter, option.pinyin) || fuzzysearch(filter, option.label)
}

export const getPinyin = (chinese) => {
  return pinyin(chinese, {style: pinyin.STYLE_NORMAL, heteronym: true}).map(array => array.join('')).join('')
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

import * as __validator__ from './validator'
export { __validator__ as validator }
