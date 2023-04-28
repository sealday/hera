import XLSX from 'xlsx-style-medalsoft'

export function downLoadExcel(
  exportElement,
  fileName,
  config,
  multiSheet,
  sheetNames
) {
  let ws
  let wb = []
  if (multiSheet) {
    exportElement.forEach((item, index) => {
      wb.push(getSheetWithMyStyle(item, config[index]))
    })
  } else {
    if (!Array.isArray(config)) {
      ws = getSheetWithMyStyle(exportElement, config)
    }
  }
  console.log(ws, 'worksheet数据')
  if (ws) {
    downLoad([ws], fileName, sheetNames)
  } else {
    downLoad(wb, fileName, sheetNames)
  }
}

// downLoad
export function downLoad(ws, fileName, sheetNames) {
  var blob = IEsheet2blob(ws, sheetNames)
  if (IEVersion() !== 11) {
    //判断ie版本
    openDownloadXLSXDialog(blob, `${fileName}.xlsx`)
  } else {
    window.navigator.msSaveOrOpenBlob(blob, `${fileName}.xlsx`)
  }
}

export function getWorkSheetElement(exportElement) {
  let ifIsArray = Array.isArray(exportElement)
  let ws = ifIsArray
    ? XLSX.utils.aoa_to_sheet(exportElement)
    : XLSX.utils.table_to_sheet(exportElement)
  return ws
}

export function getSheetWithMyStyle(exportElement, config, callback) {
  //样式处理函数,返回ws对象，如果要对ws对象进行自定义的修改，可以单独调用此函数获得ws对象进行修改
  try {
    let ws = getWorkSheetElement(exportElement)
    console.log(config, 'excel配置参数')
    //根据data类型选择worksheet对象生成方式
    if (config.merge) {
      ws['!merges'] = config.merge
    }
    ws['!cols'] = config.size.cols
    //all样式的基本格式请参考xlsx-style内xlsx.js文件内的defaultCellStyle
    if (config.myStyle) {
      if (config.myStyle.all) {
        //作用在所有单元格的样式，必须在最顶层，然后某些特殊样式在后面的操作中覆盖基本样式
        Object.keys(ws).forEach((item, index) => {
          if (ws[item].t) {
            ws[item].s = config.myStyle.all
          }
        })
      }
      if (config.myStyle.headerColor) {
        if (config.myStyle.headerLine) {
          let line = config.myStyle.headerLine
          let p = /^[A-Z]{1}[A-Z]$/
          Object.keys(ws).forEach((item, index) => {
            for (let i = 1; i <= line; i++) {
              if (
                item.replace(i.toString(), '').length == 1 ||
                p.test(item.replace(i.toString(), ''))
              ) {
                let headerStyle = getDefaultStyle()
                headerStyle.fill.fgColor.rgb = config.myStyle.headerColor
                headerStyle.font.color.rgb = config.myStyle.headerFontColor
                ws[item].s = headerStyle
              }
            }
          })
        }
      }
      if (config.myStyle.specialCol) {
        config.myStyle.specialCol.forEach((item, index) => {
          item.col.forEach((item1, index1) => {
            Object.keys(ws).forEach((item2, index2) => {
              if (item.expect && item.s) {
                if (item2.includes(item1) && !item.expect.includes(item2)) {
                  ws[item2].s = item.s
                }
              }
              if (item.t) {
                if (item2.includes(item1) && ws[item2].t) {
                  ws[item2].t = item.t
                }
              }
            })
          })
        })
      }

      if (config.myStyle.bottomColor) {
        if (config.myStyle.rowCount) {
          Object.keys(ws).forEach((item, index) => {
            if (item.indexOf(config.myStyle.rowCount.toString()) != -1) {
              let bottomStyle = getDefaultStyle()
              bottomStyle.fill.fgColor.rgb = config.myStyle.bottomColor
              ws[item].s = bottomStyle
            }
          })
        }
      }
      config.myStyle?.specialHeader?.forEach((item, index) => {
        Object.keys(ws).forEach((item1, index1) => {
          if (item.cells.includes(item1)) {
            ws[item1].s.fill = {
              fgColor: {
                rgb: item.rgb,
              },
            }
            if (item.color) {
              ws[item1].s.font.color = {
                rgb: item.color,
              }
            }
          }
        })
      })
      if (config.myStyle.heightLightColor) {
        Object.keys(ws).forEach((item, index) => {
          if (
            ws[item].t === 's' &&
            ws[item].v &&
            ws[item].v.includes('%') &&
            !item.includes(config.myStyle.rowCount.toString())
          ) {
            if (Number(ws[item].v.replace('%', '')) < 100) {
              ws[item].s = {
                fill: {
                  fgColor: {
                    rgb: config.myStyle.heightLightColor,
                  },
                },
                font: {
                  name: 'Meiryo UI',
                  sz: 11,
                  color: {
                    auto: 1,
                  },
                },
                border: {
                  top: {
                    style: 'thin',
                    color: {
                      auto: 1,
                    },
                  },
                  left: {
                    style: 'thin',
                    color: {
                      auto: 1,
                    },
                  },
                  right: {
                    style: 'thin',
                    color: {
                      auto: 1,
                    },
                  },
                  bottom: {
                    style: 'thin',
                    color: {
                      auto: 1,
                    },
                  },
                },
                alignment: {
                  /// 自动换行
                  wrapText: 1,
                  // 居中
                  horizontal: 'center',
                  vertical: 'center',
                  indent: 0,
                },
              }
            }
          }
        })
      }

      config.myStyle?.rowCells?.row.forEach((item, index) => {
        Object.keys(ws).forEach((item1, index1) => {
          let num = Number(dislodgeLetter(item1))
          if (num == Number(item)) {
            ws[item1].s = config.myStyle.rowCells.s
          }
        })
      })
      if (!Array.isArray(exportElement) && config.myStyle.mergeBorder) {
        //对导出合并单元格无边框的处理，只针对dom导出，因为只有dom导出会出现合并无边框的情况
        let arr = [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
        ]
        let range = config.myStyle.mergeBorder
        range.forEach((item, index) => {
          if (item.s.c == item.e.c) {
            //行相等,横向合并
            let star = item.s.r
            let end = item.e.r
            for (let i = star + 1; i <= end; i++) {
              ws[arr[i] + (Number(item.s.c) + 1)] = {
                s: ws[arr[star] + (Number(item.s.c) + 1)].s,
              }
            }
          } else {
            //列相等，纵向合并
            let star = item.s.c
            let end = item.e.c
            for (let i = star + 1; i <= end; i++) {
              ws[arr[item.s.r] + (i + 1)] = {
                s: ws[arr[item.s.r] + (star + 1)].s,
              }
            }
          }
        })
      }
    }

    callback && callback()
    Object.keys(ws).forEach((item, index) => {
      //空数据处理，单元格值为空时不显示null
      if (ws[item].t === 's' && !ws[item].v) {
        ws[item].v = '-'
      }
    })
    Object.keys(ws).forEach((item, index) => {
      //空数据处理，单元格值为空时不显示null
      if (ws[item].t === 's' && ws[item].v.includes('%')) {
        ws[item].v = ws[item].v.includes('.')
          ? ws[item].v.replace('%', '').split('.')[1] === '0'
            ? `${ws[item].v.replace('%', '').split('.')[0]}%`
            : ws[item].v
          : ws[item].v
      }
    })

    return ws
  } catch (e) {
    throw e
  }
}

function transIndexToLetter(num) {
  //数字转字母坐标，25->Z ,26-> AA
  if (num < 26) {
    return String.fromCharCode(num + 65)
  } else {
    return (
      transIndexToLetter(Math.floor(num / 26) - 1) +
      transIndexToLetter(num % 26)
    )
  }
}

function dislodgeLetter(str) {
  //去掉字符串中的字母
  var result
  var reg = /[a-zA-Z]+/ //[a-zA-Z]表示bai匹配字母，dug表示全局匹配
  while ((result = str.match(reg))) {
    //判断str.match(reg)是否没有字母了
    str = str.replace(result[0], '') //替换掉字母  result[0] 是 str.match(reg)匹配到的字母
  }
  return str
}

export function sheetToJSON(wb, option) {
  return XLSX.utils.sheet_to_json(wb, option)
}

// IEsheet2blob
function IEsheet2blob(sheet, sheetName) {
  console.log(sheet, 'sheet')
  console.log(sheetName, 'sheetName')
  try {
    new Uint8Array([1, 2]).slice(0, 2)
  } catch (e) {
    //IE或有些浏览器不支持Uint8Array.slice()方法。改成使用Array.slice()方法
    Uint8Array.prototype.slice = Array.prototype.slice
  }
  sheetName = Array.isArray(sheetName)
    ? sheetName.length
      ? sheetName
      : ['sheet1']
    : 'sheet1'
  var workbook = {
    SheetNames: Array.isArray(sheetName) ? sheetName : [sheetName],
    Sheets: {},
  }
  if (Array.isArray(sheetName)) {
    sheetName.forEach((item, index) => {
      workbook.Sheets[item] = sheet[index]
    })
  } else {
    workbook.Sheets[sheetName] = sheet
  }
  console.log(workbook, 'workbook')
  // 生成excel的配置项
  var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary',
  }
  var wbout = XLSX.write(workbook, wopts)
  var blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  })
  // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }
  return blob
}

// sheetToWorkBook
export function sheetToWorkBook(sheet, sheetName) {
  console.log(sheet, 'sheet')
  console.log(sheetName, 'sheetName')
  try {
    new Uint8Array([1, 2]).slice(0, 2)
  } catch (e) {
    //IE或有些浏览器不支持Uint8Array.slice()方法。改成使用Array.slice()方法
    Uint8Array.prototype.slice = Array.prototype.slice
  }
  sheetName = sheetName || 'sheet1'
  var workbook = {
    SheetNames: Array.isArray(sheetName) ? sheetName : [sheetName],
    Sheets: {},
  }
  if (Array.isArray(sheetName)) {
    sheetName.forEach((item, index) => {
      workbook.Sheets[item] = sheet[index]
    })
  } else {
    workbook.Sheets[sheetName] = sheet
  }
  console.log(workbook, 'workbook')
  // 生成excel的配置项
  var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary',
  }
  var wbout = XLSX.write(workbook, wopts)
  return wbout
}

function getDefaultStyle() {
  let defaultStyle = {
    fill: {
      fgColor: {
        rgb: '',
      },
    },
    font: {
      name: 'Meiryo UI',
      sz: 11,
      color: {
        rgb: '',
      },
      bold: true,
    },
    border: {
      top: {
        style: 'thin',
        color: {
          auto: 1,
        },
      },
      left: {
        style: 'thin',
        color: {
          auto: 1,
        },
      },
      right: {
        style: 'thin',
        color: {
          auto: 1,
        },
      },
      bottom: {
        style: 'thin',
        color: {
          auto: 1,
        },
      },
    },
    alignment: {
      /// 自动换行
      wrapText: 1,
      // 居中
      horizontal: 'center',
      vertical: 'center',
      indent: 0,
    },
  }
  return defaultStyle
}

// IEVersion
function IEVersion() {
  var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
  var isIE =
    userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE //判断是否IE的Edge浏览器
  var isIE11 =
    userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion == 7) {
      return 7
    } else if (fIEVersion == 8) {
      return 8
    } else if (fIEVersion == 9) {
      return 9
    } else if (fIEVersion == 10) {
      return 10
    } else {
      return 6 //IE版本<=7
    }
  } else if (isEdge) {
    return 'edge' //edge
  } else if (isIE11) {
    return 11 //IE11
  } else {
    return -1 //不是ie浏览器
  }
}
// openDownloadXLSXDialog
function openDownloadXLSXDialog(url, saveName) {
  try {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url) // 创建blob地址
    }
    var aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event
    if (window.MouseEvent) event = new MouseEvent('click')
    else {
      event = document.createEvent('MouseEvents')
      event.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
    }
    aLink.dispatchEvent(event)
  } catch (e) {
    throw e
  }
}

// uploadExcel
export function uploadExcel(exportElement, fileName, config) {
  let ws = getSheetWithMyStyle(exportElement, config)
  console.log(ws, 'worksheet数据')
  downLoad(ws, fileName)
}

export default {
  downLoad,
  downLoadExcel,
  getWorkSheetElement,
  getSheetWithMyStyle,
  transIndexToLetter,
  getDefaultStyle,
  sheetToWorkBook,
  sheetToJSON,
}
