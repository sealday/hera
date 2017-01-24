/**
 * Created by seal on 15/01/2017.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { transformArticle } from '../utils'
import TransferTable from './TransferTable'
import { requestOutRecords } from '../actions'


class TransferOutTable extends Component {
  componentDidMount() {
    this.props.dispatch(requestOutRecords())
  }

  render() {
    return (
      <div>
        {this.props.fetching && (
          <div className="alert alert-info">
            <p>正在请求出库单列表</p>
          </div>
        )}
        <TransferTable
          stock="inStock"
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    outStock: state.system.base._id,
    records: state.store.in,
    projects: state.system.projects,
    fetching: state.store.fetching_out,
    articles: state.system.articles.toArray(),
    ...transformArticle(state.system.articles.toArray())
  }
}


export default connect(mapStateToProps)(TransferOutTable)
