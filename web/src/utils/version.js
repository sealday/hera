//  获取版本号和版本更新时间
import { formatDate } from './date'
const packageConfig = require("../../package.json")

export const versionNumber = packageConfig?.version
export const versionTime = formatDate("yyyy-MM-dd hh:mm:ss")