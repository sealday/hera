import moment from 'moment'

let formatNumber_
let currencyFormat_
let numberFormat_
let percentFormat_

if (typeof window !== 'undefined' && window.Intl || typeof global !== 'undefined' && global.Intl) {
  formatNumber_ = (number: any) => {
    return isNaN(number) ? '' : new Intl.NumberFormat().format(number)
  }
  currencyFormat_ = (number: any, fractionDigits = 2) => {
    const options = { style: 'currency', currency: 'CNY', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
    const numberFormat = new Intl.NumberFormat('zh-CN', options)
    return number ? numberFormat.format(number) : numberFormat.format(0)
  }
  percentFormat_ = (number: any, fractionDigits = 2) => {
    const options = { style: 'percent', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
    const numberFormat = new Intl.NumberFormat('zh-CN', options)
    return number ? numberFormat.format(number) : numberFormat.format(0)
  }
  numberFormat_ = (number: any, fractionDigits = 2) => {
    if (typeof number === 'undefined' || Number.isNaN(number)) {
      return ''
    }
    const numberFormat = new Intl.NumberFormat('zh-CN', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })
    return numberFormat.format(number)
  }
} else {
  formatNumber_ = (number: any) => number
  currencyFormat_ = (number: any) => {
    return isNaN(number) ? '' : number
  }
  numberFormat_ = (number: any) => number
  percentFormat_ = (number: any) => number
}

export const formatNumber = formatNumber_
export const currencyFormat = currencyFormat_
export const numberFormat = numberFormat_
export const percentFormat = percentFormat_
export const dateFormat = (date: string | Date) => moment(date).format('YYYY-MM-DD')