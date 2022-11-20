import { formatDate } from './date'
const packageConfig = require("../../package.json")

const getVersionNumber = () => {
    return packageConfig?.version
}

const getVersionTime = () => {
    return formatDate("yyyy-MM-dd hh:mm:ss")
}

export const versionNumber = getVersionNumber()
export const versionTime = getVersionTime()