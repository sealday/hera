const moment = require('moment')

let formatNumber_
let currencyFormat_
let numberFormat_
let percentFormat_

if (typeof window !== 'undefined' && window.Intl || typeof global !== 'undefined' && global.Intl) {
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

exports.formatNumber = formatNumber_
exports.currencyFormat = currencyFormat_
exports.numberFormat = numberFormat_
exports.percentFormat = percentFormat_
exports.dateFormat = date => moment(date).format('YYYY-MM-DD')

