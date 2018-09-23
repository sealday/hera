import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'


class RentCalcPreview extends React.Component {

  render() {
    const { router } = this.props

    return (
      <div>
        <div className="hidden-print" style={{ display: 'flex' }}>
          <span style={{ flex: 1 }} />
          <Button onClick={() => router.goBack()}>返回</Button>
          <Button color="primary" onClick={() => window.print()}>打印</Button>
        </div>
        <div style={{ position: 'relative', paddingRight: '1.2em', minHeight: '30em' }}> {/* 表格开始 */}
        <table style={{ width: '100%' }}>
          <tr>
            <th colSpan={11} style={{ textAlign: 'center' }}>上海创兴建筑设备租赁有限公司对账单</th>
          </tr>
          <tr>
            <td colSpan={11} style={{ textAlign: 'center' }}>客户各项费用明细</td>
          </tr>
          <tr>
            <td>合同编号：</td>
            <td colSpan={4}></td>
            <td>日期区间：</td>
            <td>2016-12-01</td>
            <td style={{ textAlign: 'center' }}>至</td>
            <td>2017-03-01</td>
            <td></td>
          </tr>
          <tr>
            <td>承租单位：</td>
            <td colSpan={4}></td>
            <td>工程项目：</td>
            <td colSpan={4}></td>
          </tr>
          <tr style={{ border: '1px solid' }}>
            <td>月份</td>
            <td>本月租金</td>
            <td>本月维修费</td>
            <td>本月赔偿费</td>
            <td>税率</td>
            <td>本月运杂费</td>
            <td colSpan={2}>本月费用小计</td>
            <td>累计费用合计</td>
            <td>本月收款</td>
            <td>累计收款</td>
          </tr>
          <tr></tr>
          <tr>
            <td>产生日期</td>
            <td>出入库类别</td>
            <td>物质名称</td>
            <td>规格</td>
            <td>单位</td>
            <td>初入数量</td>
            <td>租赁单价</td>
            <td>天日</td>
            <td>租赁金额</td>
            <td>运费</td>
            <td>备注</td>
          </tr>
          <tr>
            <td>钢管在租数量</td>
            <td>扣件在租数量</td>
          </tr>
          <tr>
            <td>3000</td>
            <td>5000</td>
          </tr>
        </table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects,
  articles: state.system.articles.toArray(),
  products: state.system.products,
  store: state.system.store,
  user: state.system.user,
  printCompany: state.system.printCompany,
})

export default connect(mapStateToProps)(RentCalcPreview)
