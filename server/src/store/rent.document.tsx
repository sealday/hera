import * as React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToStream,
} from '@react-pdf/renderer'
import * as QRCode from 'qrcode'
import { Calc, Contract } from 'src/schemas/contract.schema'
import {
  currencyFormat,
  dateFormat,
  numberFormat,
  percentFormat,
} from 'hera-core'
import moment = require('moment')
import { Project } from 'src/app/app.service'
import _ = require('lodash')

const fontSizes = {
  title: '12px',
  subTitle: '9px',
  main: '9px',
  side: '9px',
}
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    fontFamily: '苹方简细体',
    padding: '12px',
  },
  title: {
    textAlign: 'center',
    fontSize: fontSizes.title,
  },
  subTitle: {
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
  },
  content: {
    flexDirection: 'row',
    marginLeft: '10pt',
    marginRight: '10pt',
  },
  main: {
    flex: 1,
  },
  side: {
    width: '11px',
    fontSize: fontSizes.side,
    paddingLeft: '2px',
  },
  tableHeader: {
    fontSize: fontSizes.main,
    flexDirection: 'row',
  },
  headerLeft: {
    width: '120px',
  },
  headerMiddle: {
    flex: 1,
  },
  headerRight: {
    width: '170px',
  },
  tableContentTitle: {
    fontSize: fontSizes.main,
    flexDirection: 'row',
  },
  tableCellLargeTitle: {
    flex: 2,
    textAlign: 'center',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
  },
  tableCellTitle: {
    flex: 1,
    textAlign: 'center',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
  },
  tableCellTitleLast: {
    flex: 1,
    textAlign: 'center',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderRight: '1px solid black',
    marginRight: '-1px',
  },
  tableContent: {
    fontSize: fontSizes.main,
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    textAlign: 'right',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderBottom: '1px solid black',
  },
  tableCellLast: {
    flex: 1,
    textAlign: 'right',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderRight: '1px solid black',
    marginRight: '-1px',
    borderBottom: '1px solid black',
  },
  tableFooter: {
    flexDirection: 'row',
  },
  tableFooterQr: {
    width: '50px',
    marginLeft: '-50px',
    transform: 'translate(50px, 0)',
  },
  tableFooterLeft: {
    flex: 1,
    fontSize: fontSizes.main,
    borderLeft: '1px solid black',
    paddingLeft: '50px',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderBottom: '1px solid black',
    marginBottom: '-1px',
  },
  tableFooterRight: {
    flex: 1,
    fontSize: fontSizes.main,
    border: '1px solid black',
    paddingRight: '50px',
    margin: '-1px',
  },
  sign: {
    marginTop: '20px',
    flexDirection: 'row',
  },
  signPart: {
    flex: 1,
    fontSize: fontSizes.main,
  },
  spacing: {
    height: '8px',
  },
  cellInOut: {
    flex: '0 1 30px',
  },
  cellCategory: {
    flex: '0 1 40px',
  },
  cellUnit: {
    flex: '0 1 20px',
  },
  cellDays: {
    flex: '0 1 20px',
  },
  cellName: {
    flex: 2,
  },
})

const PreviewDocument = ({
  imageUrl,
  calc,
  project,
  contract,
}: {
  imageUrl: string
  calc: Calc
  project: Project
  contract: Contract
}) => {
  // 汇总
  const group = {
    租金: 0,
    维修人工: 0,
    无物赔偿: 0,
    有物赔偿: 0,
    装卸运费: 0,
  }
  _.concat(calc.list, calc.history).forEach(item => {
    group[item.category] += item.price
  })
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {project.associatedCompany ?? '上海创兴建筑设备租赁有限公司'} 对账单
        </Text>
        <Text style={styles.subTitle}>客户各项费用明细</Text>
        <View style={styles.content}>
          <View style={styles.main}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>客户号：{project.code}</Text>
              <Text style={styles.headerMiddle}>
                承租单位：{project.company}
              </Text>
              <Text style={styles.headerRight}>
                签约时间：{dateFormat(contract.date)}
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>合同编号：{contract.code}</Text>
              <Text style={styles.headerMiddle}>项目名称：{project.name}</Text>
              <Text style={styles.headerRight}>
                结算时间：{dateFormat(calc.start)} 至 {dateFormat(calc.end)}
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>状态：{contract.status}</Text>
              <Text style={styles.headerMiddle}>
                项目地址：{project.address}
              </Text>
              <Text style={styles.headerRight}>经办人：</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>备注：</Text>
              <Text style={styles.headerMiddle}>
                项目联系人电话：
                {project.contacts
                  .map(contract => contract.name + ' ' + contract.phone)
                  .join(' ')}
              </Text>
              <Text style={styles.headerRight}>经办人电话：</Text>
            </View>
            <View style={styles.spacing} />
            <View style={styles.tableContentTitle}>
              <Text style={[styles.tableCellTitle, styles.tableCellTitleLast]}>
                本期汇总
              </Text>
            </View>
            <View style={styles.tableContentTitle}>
              <Text style={styles.tableCellTitle}>租金</Text>
              <Text style={styles.tableCellTitle}>维修人工</Text>
              <Text style={styles.tableCellTitle}>无物赔偿</Text>
              <Text style={styles.tableCellTitle}>有物赔偿</Text>
              <Text style={styles.tableCellTitle}>装卸运费</Text>
              <Text style={styles.tableCellTitle}>税率</Text>
              <Text style={styles.tableCellTitle}>本期费用</Text>
              <Text style={styles.tableCellTitle}>累计费用</Text>
              <Text style={styles.tableCellTitle}>本期收款</Text>
              <Text style={styles.tableCellTitleLast}>累计收款</Text>
            </View>
            <View style={styles.tableContent}>
              <Text style={styles.tableCell}>
                {currencyFormat(group['租金'])}
              </Text>
              <Text style={styles.tableCell}>
                {currencyFormat(group['维修人工'])}
              </Text>
              <Text style={styles.tableCell}>
                {currencyFormat(group['无物赔偿'])}
              </Text>
              <Text style={styles.tableCell}>
                {currencyFormat(group['有物赔偿'])}
              </Text>
              <Text style={styles.tableCell}>
                {currencyFormat(group['装卸运费'])}
              </Text>
              <Text style={styles.tableCell}>
                {percentFormat(calc.taxRate, 0)}
              </Text>
              <Text style={styles.tableCell}>
                {currencyFormat(
                  calc.includesTax
                    ? _.sum(_.values(group))
                    : _.sum(_.values(group)) * (1 + (calc.taxRate ?? 0))
                )}
              </Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCellLast}></Text>
            </View>
            <View style={styles.spacing} />
            <View style={styles.tableContentTitle}>
              <Text style={styles.tableCellTitle}>产生日期</Text>
              <Text style={[styles.tableCellTitle, styles.cellInOut]}>
                出入库
              </Text>
              <Text style={[styles.tableCellTitle, styles.cellName]}>
                物质名称
              </Text>
              <Text style={[styles.tableCellTitle, styles.cellCategory]}>
                费用类别
              </Text>
              <Text style={[styles.tableCellTitle, styles.cellUnit]}>单位</Text>
              <Text style={styles.tableCellTitle}>出入库数量</Text>
              <Text style={styles.tableCellTitle}>租赁单价</Text>
              <Text style={[styles.tableCellTitle, styles.cellDays]}>天日</Text>
              <Text style={styles.tableCellTitleLast}>租费金额</Text>
            </View>
            {calc.history.map(item => (
              <View style={styles.tableContent}>
                <Text style={styles.tableCell}>上期结存</Text>
                <Text style={[styles.tableCell, styles.cellInOut]}></Text>
                <Text style={[styles.tableCell, styles.cellName]}>
                  {item.name}
                </Text>
                <Text style={[styles.tableCell, styles.cellCategory]}>
                  {item.category}
                </Text>
                <Text style={[styles.tableCell, styles.cellUnit]}>
                  {item.unit}
                </Text>
                <Text style={styles.tableCell}>{numberFormat(item.count)}</Text>
                <Text style={styles.tableCell}>
                  {currencyFormat(item.unitPrice, 4)}
                </Text>
                <Text style={[styles.tableCell, styles.cellDays]}>
                  {item.days}
                </Text>
                <Text style={styles.tableCellLast}>
                  {currencyFormat(item.price)}
                </Text>
              </View>
            ))}
            {calc.list.map(item => (
              <View style={styles.tableContent} wrap={false}>
                <Text style={styles.tableCell}>
                  {moment(item.outDate).format('YYYY-MM-DD')}
                </Text>
                <Text style={[styles.tableCell, styles.cellInOut]}>
                  {item.inOut}
                </Text>
                <Text style={[styles.tableCell, styles.cellName]}>
                  {item.name}
                </Text>
                <Text style={[styles.tableCell, styles.cellCategory]}>
                  {item.category}
                </Text>
                <Text style={[styles.tableCell, styles.cellUnit]}>
                  {item.unit}
                </Text>
                <Text style={styles.tableCell}>{numberFormat(item.count)}</Text>
                <Text style={styles.tableCell}>
                  {currencyFormat(item.unitPrice, 4)}
                </Text>
                <Text style={[styles.tableCell, styles.cellDays]}>
                  {item.days}
                </Text>
                <Text style={styles.tableCellLast}>
                  {currencyFormat(item.price)}
                </Text>
              </View>
            ))}
            <View style={styles.spacing} />
            <View style={styles.tableContentTitle}>
              <Text style={styles.tableCellTitle}>产生日期</Text>
              <Text style={styles.tableCellTitle}>物质名称</Text>
              <Text style={styles.tableCellTitle}>在租数量</Text>
              <Text style={styles.tableCellTitle}>单位</Text>
              <Text style={styles.tableCellTitleLast}></Text>
            </View>
            {calc.nameGroup.map(item => (
              <View style={styles.tableContent}>
                <Text style={styles.tableCell}>本期结存</Text>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.count}</Text>
                <Text style={styles.tableCell}>{item.unit}</Text>
                <Text style={styles.tableCellLast}></Text>
              </View>
            ))}
            <View style={styles.tableFooter}>
              <View style={styles.tableFooterQr}>
                <Image src={imageUrl} />
              </View>
              <View style={styles.tableFooterLeft}>
                <Text>
                  备注：承租单位收到租费单结算明细15日内未提异议即视为确认。请签字盖章后邮寄一份至上海市松江区方塔北路571号3楼财务室
                </Text>
              </View>
              <Text style={styles.tableFooterRight}>
                出租单位：
                {project.associatedCompany ?? '上海创兴建筑设备租赁有限公司'}
                【赫拉软件】
              </Text>
            </View>
            <View style={styles.sign}>
              <Text style={styles.signPart}>制表人：</Text>
              <Text style={styles.signPart}>审核人：</Text>
              <Text style={styles.signPart}>验收：</Text>
            </View>
            <View style={styles.sign}>
              <Text style={styles.signPart}>承租单位项目经理：</Text>
              <Text style={styles.signPart}>材料负责人： </Text>
              <Text style={styles.signPart}>出租单位代表人：</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export const renderIt = async (rent: {
  calc: Calc
  contract: Contract
  project: Project
}) => {
  const url = 'http://985.so/bpw6g'
  const imageUrl = await QRCode.toDataURL(url)
  return await renderToStream(<PreviewDocument imageUrl={imageUrl} {...rent} />)
}
