//  获取版本号和版本更新时间, 并更新到临时版本文件中
const fs = require('fs');
const packageConfig = require("../package.json")

const formatDate = (fmt, timeStamp) => {
    let dateRaw = ""
  
    if (timeStamp) {
        dateRaw = new Date(timeStamp)
    } else {
        dateRaw = new Date()
    }
  
    const dateMap = {
        "yyyy":dateRaw.getFullYear(), // 年
        "MM": dateRaw.getMonth() + 1, // 月
        "dd": dateRaw.getDate(), // 日
        "hh": dateRaw.getHours(), // 时
        "mm": dateRaw.getMinutes(), // 分
        "ss": dateRaw.getSeconds(), // 秒
    };
  
  
    // 补0处理
    const replaceFunc = matched => {
        const firstResult = dateMap[matched];
        if (`${firstResult}`.length < 2) {
            return `0${firstResult}`
        }
  
        return firstResult
    }
  
    return fmt.replace(/yyyy|MM|dd|hh|mm|ss/gi, replaceFunc);
}

// 版本号自动加一
const updateVersionNumber = (prevVersion = '1.0.0') => {
  // 校验形如“3.0.1”的正则表达式
  const versionRegexpPattern =
    /^(([0-9]|([1-9]([0-9]*))).){2}([0-9]|([1-9]([0-9]*)))([-](([0-9A-Za-z]|([1-9A-Za-z]([0-9A-Za-z]*)))[.]){0,}([0-9A-Za-z]|([1-9A-Za-z]([0-9A-Za-z]*)))){0,1}([+](([0-9A-Za-z]{1,})[.]){0,}([0-9A-Za-z]{1,})){0,1}$/

  if (versionRegexpPattern.test(prevVersion)) {
    let [majorNumber, minorNumber, patchNumber] = prevVersion
      .split('.')
      .map(num => +num)

    if (patchNumber < 99) {
      patchNumber++
    } else if (minorNumber < 99) {
      minorNumber++
    } else {
      majorNumber++
    }

    return `${majorNumber}.${minorNumber}.${patchNumber}`
  } else {
    return '1.0.0'
  }
}

module.exports = {
  updateVersionTime: () => {
    // 小版本号自动加1
    const versionNumber = updateVersionNumber(packageConfig?.version)
    const versionTime = formatDate('yyyy-MM-dd hh:mm:ss')
    const versionInfo = {
      versionNumber,
      versionTime,
    }
    const versionData = JSON.stringify(versionInfo, null, '\t')
    fs.writeFile('./src/version.json', versionData, err => {
      if (err) {
        throw err
      }
    })

    // 同步更新 package.json 里的版本信息
    packageConfig.version = versionNumber
    const packageConfigData = JSON.stringify(packageConfig, '', '  ')
    fs.writeFile('../package.json', packageConfigData, err => {
      if (err) {
        throw err
      }
    })

    console.log('版本信息更新成功!!!', versionNumber, versionTime)
  },
}
