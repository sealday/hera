/**
 * Created by seal on 15/01/2017.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { transformArticle } from '../utils'
import TransferTable from './TransferTable'


class TransferOutTable extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.dispatch({ type: 'REQUEST_OUT_RECORDS', status: 'NEED_REQUEST' })
  }

  render() {
    let alert = false

    if (this.props.status == 'REQUESTING') {
      alert = (
        <div className="alert alert-info">
          正在请求出库单列表，请稍后
        </div>
      )
    }

    return (
      <div>
        {alert}
        <TransferTable
          direction="出库"
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const bases = state.projects.filter(project => project.type == '基地仓库')
  const outStock = bases.length > 0 ? bases[0]._id : ''
  return {
    outStock,
    records: state.outRecords,
    projects: state.projects,
    projectIdMap: state.projectIdMap,
    status: state.outRecordsRequestStatus,
    articles: state.articles,
    ...transformArticle(state.articles)
  }
}


export default connect(mapStateToProps)(TransferOutTable)
