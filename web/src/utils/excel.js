import { dateFormat } from 'hera-core'
import { saveAs } from 'file-saver'
// import XLSX_STYLE from 'xlsx-style-hzx'
// 使用前端库 SheetJS-xlsx导出excel文件
// 文档地址：https://docs.sheetjs.com/docs/
// 为了定制样式，参考 https://juejin.cn/post/6903820868859002888#heading-8 改造导出excel的方法
// 导出excel表格
// 最终选中 xlsx-style-hzx 为导出库，基于 xlsx-style， xlsx-style又基于 xlsx 开发。
export const exportExcel = ({ XLSX, XLSX_STYLE }, data, name) => {
  console.log(
    '%c Line:10 🍡 XLSX',
    'font-size:18px;color:#fca650;background:#42b983',
    XLSX
  )
  console.log(
    '%c Line:10 🥖 XLSX_STYLE',
    'font-size:18px;color:#6ec1c2;background:#e41a6a',
    XLSX_STYLE
  )
  // 创建 workbook 对象
  const workbook = XLSX.utils.book_new()

  // 获取创建好的电子表格对象，已经设置好单元格样式，字体样式等细化配置
  const worksheet = getWorksheetWithStyle(XLSX, data)

  // 创建工作簿对象并添加电子表格
  XLSX.utils.book_append_sheet(workbook, worksheet, '结算表')
  console.log(
    '%c Line:28 🍿 worksheet',
    'font-size:18px;color:#4fff4B;background:#ed9ec7',
    worksheet
  )

  // 导出 Excel
  downLoadExcel(XLSX_STYLE, workbook, name)
}

// 配置excel表格样式，业务强相关
const getWorksheetWithStyle = (XLSX, data) => {
  // 构建表头数据
  const header = [['华东公司料具租赁站'], ['料具租赁费用结算单']]

  // 创建 worksheet 对象, 将表头插入到第一二行
  const worksheet = XLSX.utils.aoa_to_sheet(header)

  // 合并单元格
  mergeCells(XLSX, worksheet)

  XLSX.utils.sheet_add_aoa(worksheet, [[`结算时段:${'金额占位'}`]], {
    origin: { r: 2, c: 0 },
  })
  XLSX.utils.sheet_add_aoa(worksheet, [[`工程名称:${'金额占位'}`]], {
    origin: { r: 2, c: 6 },
  })

  // 获取表格主要内容数据
  const cookedData = getRegularAoaData(data)
  // 解析工作表的数据范围，获取当前的行列数
  const range = XLSX.utils.decode_range(worksheet['!ref'])
  // for (let r = range.s.r; r <= range.e.r; r++) {
  //   for (let c = range.s.c; c <= range.e.c; c++) {
  //     const cell = ws[XLSX.utils.encode_cell({ r: r, c: c })];
  //     cell.s = style;
  //   }
  // }
  XLSX.utils.sheet_add_aoa(worksheet, cookedData, { origin: { r: 3, c: 0 } })
  // 将表尾插入到最后一行
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [['华东公司料具租赁站'], ['料具租赁费用结算单']],
    { origin: -1 }
  )

  // 定制样式
  // 设置默认列宽和行高
  worksheet['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 20 }]
  worksheet['!rows'] = [
    { hpt: 50, hpx: 50 },
    { hpt: 25, hpx: 25 },
    { hpt: 25, hpx: 25 },
    { hpt: 25, hpx: 25 },
    { hpt: 25, hpx: 25 },
    { hpt: 25, hpx: 25 },
    { hpt: 25, hpx: 25 },
    { hpt: 25, hpx: 25 },

    { hpt: 25 },
    { hpt: 25 },
    { hpt: 25 },
    { hpt: 25 },
    { hpt: 25 },
    { hpt: 25 },
  ]
  setExcelWithStyle(XLSX, worksheet, range)

  return worksheet
}

// 合并单元格
const mergeCells = (XLSX, worksheet) => {
  if (!worksheet['!merges']) worksheet['!merges'] = []
  worksheet['!merges'].push(
    XLSX.utils.decode_range('A1:L1'),
    XLSX.utils.decode_range('A2:L2'),
    XLSX.utils.decode_range('A3:F3'),
    XLSX.utils.decode_range('G3:L3')
  )
}
// 设置样式, 业务强相关
const setExcelWithStyle = (XLSX, ws, range) => {
  // 设置一些基础样式
  const alignmentCenter = {
    // 对齐方式，居中
    horizontal: 'center',
    vertical: 'center',
    wrapText: true,
  }
  // 给单元格添加样式
  // 设置表头样式, "华东公司料具租赁站"
  ws['A1'].s = {
    font: {
      name: '宋体',
      sz: 16,
      bold: true,
      italic: false,
      color: { auto: 1 },
    },
    alignment: {
      // 对齐方式，居中
      horizontal: 'center',
      vertical: 'center',
      wrapText: true,
    },
  }

  // "料具租赁费用结算单"
  ws['A2'].s = {
    font: {
      name: '宋体',
      sz: 11,
      bold: false,
      italic: false,
      color: { auto: 1 },
    },
    alignment: alignmentCenter,
  }

  const headerTips = ['A3', 'G3']
  headerTips.forEach(item => {
    ws[item].s = {
      font: {
        name: 'Arial',
        sz: 12,
        bold: false,
        italic: false,
        color: { auto: 1 },
      },
      alignment: { ...alignmentCenter, horizontal: 'left' },
    }
  })

  // Object.keys(worksheet).forEach(key => {
  //   worksheet[key].s = {
  //     border: {
  //       //边框
  //       // bottom: { style: 'thin', color: 'FFd4d4d4' },
  //       left: { style: 'thin', color: '00D4D4D4' },
  //       top: { style: 'thin', color: '00D4D4D4' },
  //       // right: { style: 'thin', color: 'FFD4D4D4' },
  //     },
  //     font: {
  //       //字体
  //       name: '宋体',
  //       sz: 14,
  //       bold: false,
  //       italic: false,
  //       color: { auto: 1 },
  //     },
  //     alignment: {
  //       // 对齐方式，居中
  //       horizontal: 'center',
  //       vertical: 'center',
  //       wrapText: true,
  //     },
  //     fill: {
  //       //填充
  //       fgColor: { rgb: 'FFFFFFFF' },
  //     },
  //   }
  // })
}

// 获取表格内容数据，将原始数据转换为二维数组，js对象形式有问题
const getRegularAoaData = rawData => {
  // 表格属性名称
  const headers = [
    '料具名称',
    '料具规格',
    '类别',
    '起租日期',
    '结算日期',
    '数量',
    '单位',
    '单价(元)',
    '天数',
    '金额(元)',
    '同类累计金额',
    '备注',
  ]
  const data = [
    ...(rawData?.history || []).map(item => [
      item.name, // 料具名称
      null,
      null,
      dateFormat(rawData?.start), // 起租日期
      dateFormat(rawData?.end), // 结算日期
      item.count,
      item.unit,
      item.unitPrice,
      item.days,
      item.price,
      null,
      null,
    ]),
    ...(rawData?.list || []).map(item => [
      item.name, // 料具名称
      null,
      null,
      dateFormat(item.inOut === '入库' ? rawData?.start : item.outDate), // 起租日期
      dateFormat(item.inOut === '入库' ? item.outDate : rawData?.end), // 结算日期
      item.count,
      item.unit,
      item.unitPrice,
      item.days,
      item.price,
      null,
      null,
    ]),
  ]
  return [headers, ...data]
}

export const rentExcelExportNewFunc = (XLSX, rent, name) => {
  const wb = XLSX.utils.book_new()
  // const jsonConfigArr = [
  //   ['料具名称', 'name'],
  //   ['起租日期', 'name'],
  //   ['结算日期', 'name'],
  //   ['数量', 'count'],
  //   ['单位', 'unit'],
  //   ['单价(元)', 'unitPrice'],
  //   ['天数', 'days'],
  //   ['金额(元)', 'price'],
  //   ['备注', ''],
  // ]
  const json = [
    ['华东公司料具租赁站'],
    ['料具租赁费用结算单'],
    [`结算时段:${'金额占位'}`, '', '', '', `工程名称:${'金额占位'}`],
    [
      '料具名称',
      '起租日期',
      '结算日期',
      '数量',
      '单位',
      '单价(元)',
      '天数',
      '金额(元)',
      '备注',
    ],
  ]
  // const json = [[
  //   '日期', '出入库', '名称', '类别', '单位', '数量', '单价', '天数', '金额', '运费'
  // ]]
  for (const item of rent.history) {
    json.push([
      item.name, // 料具名称
      dateFormat(rent?.start), // 起租日期
      dateFormat(rent?.end), // 结算日期
      item.count,
      item.unit,
      item.unitPrice,
      item.days,
      item.price,
      null,
    ])
    // json.push([
    //   '上期结存',
    //   null,
    //   item.name,
    //   item.category,
    //   item.unit,
    //   item.count,
    //   item.unitPrice || 0,
    //   item.days,
    //   item.price,
    //   0,
    // ])
  }
  for (const item of rent.list) {
    // json.push([
    //   dateFormat(item.outDate),
    //   item.inOut,
    //   item.name,
    //   item.category,
    //   item.unit,
    //   item.count,
    //   item.unitPrice || 0,
    //   item.days,
    //   item.price,
    //   item.freight || 0,
    // ])
    json.push([
      item.name, // 料具名称
      dateFormat(item.inOut === '入库' ? rent?.start : item.outDate), // 起租日期
      dateFormat(item.inOut === '入库' ? item.outDate : rent?.end), // 结算日期
      item.count,
      item.unit,
      item.unitPrice,
      item.days,
      item.price,
      null,
    ])
  }

  // 表尾
  json.push(
    ['总计：', '', '', '', '', '', '', '金额占位'],
    [`大写总计：${'金额占位'}`],
    ['供方签章', '', '供方经办', '', '需方经办', '', '需方签章']
  )

  const sheet = XLSX.utils.aoa_to_sheet(json)
  const range = XLSX.utils.decode_range(sheet['!ref'])

  // 数量 5
  // 单价 6
  // 金额 8
  // 运费 9
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let format
    switch (C) {
      case 5:
        format = '#,##0.00_ ;-#,##0.00'
        break
      case 6:
        format = '#,##0.0000_ '
        break
      case 8:
        format = '#,##0.00_ ;[red]-#,##0.00'
        break
      case 9:
        format = '#,##0.00_ ;-#,##0.00'
        break
      default:
        continue
    }
    for (let R = range.s.r; R <= range.e.r; ++R) {
      if (R === 0) continue
      const cell_address = { c: C, r: R }
      const cell_ref = XLSX.utils.encode_cell(cell_address)
      if (sheet[cell_ref]) {
        sheet[cell_ref] = XLSX.utils.cell_set_number_format(
          sheet[cell_ref],
          format
        )
      }
    }
  }
  XLSX.utils.book_append_sheet(wb, sheet, '结算表')

  const out = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    compression: true,
  })
  const s2ab = s => {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff
    }
    return buf
  }
  saveAs(
    new Blob([s2ab(out)], { type: 'application/octet-stream' }),
    name + '.xlsx'
  )
}

export const exportExcelFunc = (XLSX, data, name) => {
  // 获取工作表对象，已经设置好单元格样式，字体样式等细化配置
  const worksheet = getWorksheetWithStyle(XLSX, data)
  console.log(
    '%c Line:285 🍏 worksheet',
    'font-size:18px;color:#7f2b82;background:#f5ce50',
    worksheet
  )

  // 获取工作簿对象
  const workbook = sheetToWorkBook(XLSX, { worksheet, sheetName: name })

  // 下载工作簿
  writeFunc(XLSX, workbook, { name })
}

// 将工作表对象转换为工作簿对象, 支持多工作表, 相应传参改为数组类型
const sheetToWorkBook = (XLSX, { worksheet, sheetName }, isMultiple) => {
  const workbook = {
    SheetNames: isMultiple ? sheetName : [sheetName || 'sheet'],
    Sheets: {},
  }
  if (isMultiple) {
    // 多工作表
    sheetName.forEach((item, index) => {
      workbook.Sheets[item] = worksheet[index]
    })
  } else {
    // 单工作表
    workbook.Sheets[sheetName] = worksheet
  }
  console.log(
    '%c Line:300 🌭 workbook',
    'font-size:18px;color:#f5ce50;background:#33a5ff',
    workbook
  )
  console.log(
    '%c Line:316 🍫 XLSX',
    'font-size:18px;color:#42b983;background:#6ec1c2',
    XLSX
  )

  // 下载工作簿
  // XLSX.writeFile(workbook, `${sheetName}.xlsx`)

  const workbook_final = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    compression: true,
  })
  console.log(
    '%c Line:306 🎂 workbook_final',
    'font-size:18px;color:#ed9ec7;background:#ffdd4d',
    workbook_final
  )

  return workbook_final
}

// FQ: 根据 workbook 导出 excel
const downLoadExcel = (XLSX_STYLE, wb, name) => {
  const out = XLSX_STYLE.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    compression: true,
  })
  const blobData = s2ab(out)
  saveAs(
    new Blob([blobData], { type: 'application/octet-stream' }),
    name + '.xlsx'
  )

  // 创建工作簿对象并添加电子表格
  // const workbook = XLSX_STYLE.utils.book_new()
  // XLSX_STYLE.utils.book_append_sheet(workbook, worksheet, '结算表')
  // 将工作簿对象导出为Excel文件
  // XLSX_STYLE.writeFile(wb, `${name}.xlsx`)
}

// FQ: 构建数据
const s2ab = s => {
  const buf = new ArrayBuffer(s.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff
  }
  return buf
}

// FQ: writeFunc
const writeFunc = (XLSX, workbook, { name }) => {
  const out = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
    compression: true,
  })
  const s2ab = s => {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff
    }
    return buf
  }
  console.log(
    '%c Line:384 🍊 s2ab',
    'font-size:18px;color:#fca650;background:#6ec1c2',
    s2ab
  )

  saveAs(
    new Blob([s2ab(out)], { type: 'application/octet-stream' }),
    name + '.xlsx'
  )
}
