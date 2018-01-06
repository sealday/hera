/**
 * Created by seal on 01/02/2017.
 */

export const required = value => value ? undefined : '不能为空'
export const isNum = value => isNaN(value) ? '请输入数字' : undefined
export const num = (value) => value && isNaN(value) ? '请输入数字' : undefined