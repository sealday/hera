import { dateFormat } from 'hera-core'
import { saveAs } from 'file-saver'

export const rentExcelExportNew = (XLSX, rent, name) => {
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
