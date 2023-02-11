// 数学计算工具

// 生成指定范围的随机整数，min <= x < max;
export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
