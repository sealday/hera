/**
 * Created by seal on 12/01/2017.
 */

export function calculateSize(size) {
  let sizes = size.split(';');
  if (isNaN(sizes[sizes.length - 1])) {
    return 1;
  } else {
    return Number(sizes[sizes.length - 1]);
  }
}

// 保留两位数，去除多余的零
export function toFixedWithoutTrailingZero(num) {
  return Number(Number(num).toFixed(2)).toString();
}
