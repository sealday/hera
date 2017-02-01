/**
 * Created by seal on 15/01/2017.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import TransferTable from './TransferTable'
import { transformArticle } from '../utils'
import { requestInRecords } from '../actions'

class TransferInTable extends Component {
  componentDidMount() {
    this.props.dispatch(requestInRecords())
  }

  render() {
    return (
      <div>
        <TransferTable
          stock="outStock"
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    inStock: state.system.base._id,
    records: state.store.in.filter(record => record.type == '销售'),
    projects: state.system.projects,
    fetching: state.store.fetching_in,
    articles: state.system.articles.toArray(),
    ...transformArticle(state.system.articles.toArray())
  }
}


export default connect(mapStateToProps)(TransferInTable)