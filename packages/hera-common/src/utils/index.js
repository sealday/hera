import moment from 'moment'
/**
 * 最多保留两位，但是移除小数点后面的零
 * @param num
 * @param last 保留几位
 * @returns {string}
 */
export function toFixed(num, last) {
  const lead = last || 2
  return Number(Number(num).toFixed(lead)).toString();
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