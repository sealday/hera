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
          direction="入库"
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const bases = state.projects.filter(project => project.type == '基地仓库')
  const inStock = bases.length > 0 ? bases[0]._id : ''
  return {
    inStock,
    records: state.inRecords,
    projects: state.projects,
    projectIdMap: state.projectIdMap,
    status: state.inRecordsRequestStatus,
    articles: state.articles,
    ...transformArticle(state.articles)
  }
}


export default connect(mapStateToProps)(TransferInTable)
