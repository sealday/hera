import * as React from 'react'
import { Document, Font, Page, Text, View, StyleSheet, PDFViewer, pdf, usePDF, Canvas, Image, renderToStream } from '@react-pdf/renderer';
import * as QRCode from 'qrcode'

const fontSizes = {
  title: '12px',
  main: '9px',
  side: '9px',
}
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    fontFamily: '苹方简细体',
    paddingTop: '12px',
  },
  title: {
    textAlign: 'center',
    fontSize: fontSizes.title,
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
    width: '100px',
  },
  headerMiddle: {
    flex: 1,
  },
  headerRight: {
    width: '100px',
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
  tableCell3: {
    flex: 3,
    textAlign: 'right',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
  },
  tableCell2: {
    flex: 2,
    textAlign: 'right',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
  },
  tableCell: {
    flex: 1,
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
  },
  tableFooter: {
    flexDirection: 'row',
  },
  tableFooterQr: {
    width: '50px',
    marginLeft: '-50px',
    transform: 'translate(50px, 0)'
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
    flexDirection: 'row',
  },
  signPart: {
    flex: 1,
    fontSize: fontSizes.main,
  }
});

const PreviewDocument = ({ imageUrl }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>上海创兴建筑设备租赁有限公司 - 入库单</Text>
        <View style={styles.content}>
          <View style={styles.main}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>客户号：0001</Text>
              <Text style={styles.headerMiddle}>承租单位：上海誉良建筑劳务有限公司	</Text>
              <Text style={styles.headerRight}>日期：2022-09-19</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>客户号：0001</Text>
              <Text style={styles.headerMiddle}>项目名称：【中建八局南京外语方山分校】	</Text>
              <Text style={styles.headerRight}>日期：2022-09-19</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>客户号码：xxxxxxx</Text>
              <Text style={styles.headerMiddle}>项目地址：江苏省南京市江宁区加州城西门丽泽路往南一公里中建八局项目部这是非常长的项目地址	</Text>
              <Text style={styles.headerRight}>日期：2022-09-19</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>客户号：0001</Text>
              <Text style={styles.headerMiddle}>项目联系人电话：周海林 18116282128 李成建 18116282165	</Text>
              <Text style={styles.headerRight}>日期：2022-09-19</Text>
            </View>
            <View style={styles.tableContentTitle}>
              <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
              <Text style={styles.tableCellTitle}>数量</Text>
              <Text style={styles.tableCellTitle}>小计</Text>
              <Text style={styles.tableCellTitle}>备注</Text>
              <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
              <Text style={styles.tableCellTitle}>数量</Text>
              <Text style={styles.tableCellTitle}>小计</Text>
              <Text style={styles.tableCellTitleLast}>备注</Text>
            </View>
            <View style={styles.tableContent}>
              <Text style={styles.tableCell2}>轮扣立杆[2.4]</Text>
              <Text style={styles.tableCell}>300 根</Text>
              <Text style={styles.tableCell}>720米</Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell2}>轮扣立杆[小计]</Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}>720 米</Text>
              <Text style={styles.tableCellLast}></Text>
            </View>
            <View style={styles.tableContent}>
              <Text style={styles.tableCell2}>轮扣立杆[2.4]</Text>
              <Text style={styles.tableCell}>300 根</Text>
              <Text style={styles.tableCell}>720米</Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell2}>轮扣立杆[小计]</Text>
              <Text style={styles.tableCell2}>720 米</Text>
              <Text style={styles.tableCellLast}></Text>
            </View>
            <View style={styles.tableFooter}>
              <View style={styles.tableFooterQr}>
                <Image src={imageUrl} />
              </View>
              <View style={styles.tableFooterLeft}>
                <Text>说明：如供需双方未签正式合同，本入库单经供需双方代表签字确认后， 将作为合同及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。出库方须核对 以上产品规格、数量确认后可签字认可。</Text>
              </View>
              <Text style={styles.tableFooterRight}>备注：</Text>
            </View>
            <View style={styles.sign}>
              <Text style={styles.signPart}>制单人：张正富	</Text>
              <Text style={styles.signPart}>出租单位（签名）：</Text>
              <Text style={styles.signPart}>租借单位（签名）：</Text>
            </View>
          </View>
          <View style={styles.side}>
            <Text>①发货方存根②收货方存根③承运方存根</Text>
          </View>
        </View>
        <View>
        </View>
      </Page>
    </Document>
  )
}

export const renderIt = async () => {
  const url = 'http://985.so/bpw6g'
  const imageUrl = await QRCode.toDataURL(url)
  return await renderToStream(<PreviewDocument imageUrl={imageUrl} />);
}