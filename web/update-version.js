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

module.exports = {
    updateVersionTime: () => {
        const versionNumber = packageConfig?.version
        const versionTime = formatDate("yyyy-MM-dd hh:mm:ss")
        const versionInfo = {  
            versionNumber,
            versionTime
        };
        const data = JSON.stringify(versionInfo)
        fs.writeFile('./src/version.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("版本信息更新成功!!!", versionNumber, versionTime)
        });
    }
};
