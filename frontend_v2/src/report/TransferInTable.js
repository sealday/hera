/**
 * Created by seal on 15/01/2017.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import TransferTable from './TransferTable'
import { transformArticle } from '../utils'

class TransferInTable extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'REQUEST_IN_RECORDS', status: 'NEED_REQUEST' })
  }

  render() {
    let alert = false

    if (this.props.status == 'REQUESTING') {
      alert = (
        <div className="alert alert-info">
          正在请求入库单列表，请稍后
        </div>
      )
    }

    return (
      <div>
        {alert}
        <TransferTable
          stock="outStock"
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const inStock = state.projects.base ? state.projects.base._id : ''
  return {
    inStock,
    records: state.inRecords,
    projects: state.projects.projects,
    projectIdMap: state.projects.projectIdMap,
    status: state.inRecordsRequestStatus,
    articles: state.articles,
    ...transformArticle(state.articles)
  }
}


export default connect(mapStateToProps)(TransferInTable)
