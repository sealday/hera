import React from 'react'
import { connect } from 'react-redux'

import TransferOrder from './TransferOrderPreview'
import PurchaseOrder from './PurchaseOrder'
import StocktakingOrder from './StocktakingOrder'
import { requestRecord } from '../actions'

class Record extends React.Component {

  componentDidMount() {
    const { id, records } = this.props
    const record = records.get(id)

    if (!record) {
      this.props.dispatch(requestRecord(id))
    }
  }

  render() {
    const { id, records, router } = this.props
    const record = records.get(id)

    // 假设本地缓存中没有则进行一次网络请求
    if (!record) {
      return (
        <div className="alert alert-info">
          <p>请求数据中，请稍后</p>
        </div>
      )
    }

    if (record.type === '调拨') {
      return <TransferOrder record={record} router={router}/>
    } else if (record.type === '销售') {
      return <PurchaseOrder record={record} router={router}/>
    } else if (record.type === '采购') {
      return <PurchaseOrder record={record} router={router}/>
    } else if (record.type === '盘点入库') {
      return <StocktakingOrder record={record} router={router}/>
    } else if (record.type === '盘点出库') {
      return <StocktakingOrder record={record} router={router}/>
    } else {
      return <div>暂时不支持显示 {record.type} 类型的详情</div>
    }
  }
}

const mapStateToProps = (state, props) => ({
  records: state.store.records,
  projects: state.system.projects,
  store: state.system.store,
  id: props.params.id
})

export default connect(mapStateToProps)(Record)
