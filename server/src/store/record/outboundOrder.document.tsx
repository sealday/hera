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
import { Contract } from 'src/schemas/contract.schema'
import { Record } from 'src/app/app.service'
import {
  dateFormat,
} from 'hera-core'
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
  tableCell2: {
    flex: 2,
    textAlign: 'right',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
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
/**
 * 
 * @param isDouble 0为单列，1为双列 
 * @returns 
 */
const PreviewDocument = ({
  imageUrl,
  record,
  project,
  contract,
  isDouble = 1
}: {
  imageUrl: string
  record: Record
  project: Project
  contract: Contract
  isDouble: Number
}) => {
  // 汇总物料总weight
  const entrieWeight = {}
  for (const entrie of record.entries) {
    if (entrieWeight[entrie.name]) {
      entrieWeight[entrie.name].push(entrie)
    } else {
      entrieWeight[entrie.name] = [entrie]
    }
  }
  for (const entrie in entrieWeight) {
    const total = entrieWeight[entrie].reduce((total, item) => total + item.weight, 0)
    entrieWeight[entrie].push({name: entrie, weight: total, size: '小计',count: '',comments:'', unit: entrieWeight[entrie][0].unit ?? ''})
  }
  const data = Object.values(entrieWeight).flat().map((item:any, index) => ({ ...item, key: index }))
  
  const dobuleData = []
  if (isDouble) {
    // 双列展示
    const leftData = data.slice(0,Math.ceil(data.length/2))
    const rightData = data.slice(Math.ceil(data.length/2))
    for (let index = 0; index < leftData.length; index++) {
      const left = Object.fromEntries(
        Object.entries(leftData[index]).map(([key, value]) => ['left_' + key, value])
      );
      let right = {}
      if (rightData.length < leftData.length && index < rightData.length) {
        right = Object.fromEntries(
          Object.entries(rightData[index]).map(([key, value]) => ['right_' + key, value])
        )   
      } else {
        right = {right_name:'', right_size:'',right_count:'',right_weight:0,right_unit:'',right_comments:''}
      }
      const result = {...left, ...right}
      dobuleData.push(result)
    }
  }
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {project.associatedCompany ?? '上海创兴建筑设备租赁有限公司'}
        </Text>
        <Text style={styles.subTitle}>出库单</Text>
        <View style={styles.content}>
          <View style={styles.main}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>客户号：{project.code}</Text>
              <Text style={styles.headerMiddle}>
                承租单位：{project.company}
              </Text>
              <Text style={styles.headerRight}>
                日期：{dateFormat(contract.date)}
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>合同编号：{contract.code}</Text>
              <Text style={styles.headerMiddle}>项目名称：{project.name}</Text>
              <Text style={styles.headerRight}>
                流水号：{record.number}
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>状态：{contract.status}</Text>
              <Text style={styles.headerMiddle}>
                项目地址：{project.address}
              </Text>
              <Text style={styles.headerRight}>原始单号：</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>经办人电话：</Text>
              <Text style={styles.headerMiddle}>
                项目联系人电话：
                {project.contacts
                  .map(contract => contract.name + ' ' + contract.phone)
                  .join(' ')}
              </Text>
              <Text style={styles.headerRight}>车号：{record.carNumber}</Text>
            </View>
            {/* 表头 */}
            {/* 单双列实现还未思考实现 */}
           {isDouble && <View style={styles.tableContentTitle}>
              <Text style={styles.tableCellTitle}>物料名称及规格</Text>
              <Text style={styles.tableCellTitle}>数量</Text>
              <Text style={styles.tableCellTitle}>小计</Text>
              <Text style={styles.tableCellTitle}>备注</Text>
              <Text style={styles.tableCellTitle}>物料名称及规格</Text>
              <Text style={styles.tableCellTitle}>数量</Text>
              <Text style={styles.tableCellTitle}>小记</Text>
              <Text style={styles.tableCellTitleLast}>备注</Text>
            </View>}
            {!!isDouble && <View style={styles.tableContentTitle}>
              <Text style={styles.tableCellTitle}>物料名称及规格</Text>
              <Text style={styles.tableCellTitle}>数量</Text>
              <Text style={styles.tableCellTitle}>小计</Text>
              <Text style={styles.tableCellTitle}>备注</Text>
            </View>}
            {/* 表格内容，主体 */}
            {!!isDouble && data.map(item => (
              <View style={styles.tableContent}>
                <Text style={styles.tableCell2}>{`${item.name}[${item.size}]`}</Text>
                <Text style={styles.tableCell}>{item.count}</Text>
                <Text style={styles.tableCell}>{`${item.weight.toFixed(2)} ${item.unit}`}</Text>
                <Text style={styles.tableCellLast}>{item.comments || ''}</Text>
              </View>
            ))}
            {isDouble && dobuleData.map(item => (
              <View style={styles.tableContent}>
                <Text style={styles.tableCell2}>{`${item.left_name}[${item.left_size}]`}</Text>
                <Text style={styles.tableCell}>{item.left_count}</Text>
                <Text style={styles.tableCell}>{`${item.left_weight.toFixed(2)} ${item.left_unit}`}</Text>
                <Text style={styles.tableCellLast}>{item.left_comments || ''}</Text>
                <Text style={styles.tableCell2}>{`${item.right_name}[${item.right_size}]`}</Text>
                <Text style={styles.tableCell}>{item.right_count}</Text>
                <Text style={styles.tableCell}>{`${item.right_weight.toFixed(2) === '0.00'? '': item.right_weight.toFixed(2)} ${item.right_unit}`}</Text>
                <Text style={styles.tableCellLast}>{item.right_comments || ''}</Text>
              </View>
            ))}
            {/* 表格底部 */}
            <View style={styles.tableFooter}>
              <View style={styles.tableFooterQr}>
                <Image src={imageUrl} />
              </View>
              <View style={styles.tableFooterLeft}>
                <Text>说明：如供需双方未签正式合同，本出库单经供需双方代表签字确认后， 将作为合同及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。入库方须核对 以上产品规格、数量确认后可签字认可。</Text>
              </View>
              <Text style={styles.tableFooterRight}>备注：</Text>
            </View>
            <View style={styles.sign}>
              <Text style={styles.signPart}>制单人： </Text>
              <Text style={styles.signPart}>出租单位（签名）：</Text>
              <Text style={styles.signPart}>租借单位（签名）：</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
export const renderIt = async (rent: {
  record: Record
  contract: Contract
  project: Project
  isDouble: Number
}) => {
  const url = 'http://985.so/bpw6g'
  const imageUrl = await QRCode.toDataURL(url)
  return await renderToStream(<PreviewDocument imageUrl={imageUrl} {...rent} />)
}
