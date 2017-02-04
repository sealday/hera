/**
 * Created by seal on 04/02/2017.
 */

import React from 'react'
import TransferOrder from './TransferOrder'
import { connect } from 'react-redux'
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
    } else {
      return <div>暂时没有详情</div>
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
