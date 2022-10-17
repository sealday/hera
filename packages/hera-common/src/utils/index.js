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