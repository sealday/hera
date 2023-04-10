import { dateFormat } from 'hera-core'
import { saveAs } from 'file-saver'
// 使用前端库 SheetJS-xlsx导出excel文件
// 文档地址：https://docs.sheetjs.com/docs/
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

// 导出excel表格
export const rentExcelExportNew = (XLSX, data, name) => {
  // 获取创建好的电子表格对象，已经设置好单元格样式，字体样式等细化配置
  const worksheet = configWorkSheetFunc(XLSX, data)
  // 创建工作簿对象并添加电子表格
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '结算表')
  // 将工作簿对象导出为Excel文件
  XLSX.writeFile(workbook, `${name}.xlsx`)
}

// 配置excel表格
const configWorkSheetFunc = (XLSX, rawData) => {
  // 构建表头数据
  const header = [
    ['华东公司料具租赁站'],
    ['料具租赁费用结算单'],
    
  ]
  // 将表头插入到第一二行
  const worksheet = XLSX.utils.aoa_to_sheet(header)
  // 合并单元格
  if (!worksheet['!merges']) worksheet['!merges'] = []
  worksheet['!merges'].push(
    XLSX.utils.decode_range('A1:L1'),
    XLSX.utils.decode_range('A2:L2'),
    XLSX.utils.decode_range('A3:F3'),
    XLSX.utils.decode_range('G3:L3')
  )
  XLSX.utils.sheet_add_aoa(worksheet, [[`结算时段:${'金额占位'}`]], { origin: { r: 2, c: 0 } })
  XLSX.utils.sheet_add_aoa(worksheet, [[`工程名称:${'金额占位'}`]], { origin: { r: 2, c: 6 } })

  // 获取表格主要内容数据
  const data = getRegularData(rawData)
  XLSX.utils.sheet_add_aoa(worksheet, data, { origin: { r: 3, c: 0 } })
  // 将表尾插入到最后一行
  // XLSX.utils.sheet_add_aoa(worksheet, [footer], { origin: -1 })

  return worksheet
}

// 获取表格内容数据，将原始数据转换为二维数组，js对象形式有问题
const getRegularData = rawData => {
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
  saveAs(
    new Blob([s2ab(out)], { type: 'application/octet-stream' }),
    name + '.xlsx'
  )
}
