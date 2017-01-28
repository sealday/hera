/**
 * Created by seal on 16/01/2017.
 */

import React, { Component } from 'react';
import { ajax, transformArticle } from '../utils';
import { connect } from 'react-redux'
import Transfer from './Transfer'
import { requestRecord } from '../actions'

class TransferInEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outStock: '', // 调入出去的仓库
    };
  }

  componentDidMount() {
    const id = this.props.params.recordId
    const record = this.props.recordIdMap[id]
    const projectIdMap = this.props.projectIdMap

    if (!record || !projectIdMap) {
      return this.props.dispatch(requestRecord(id))
    }

    this.setState({
      outStock: record.outStock
    })
  }

  handleProjectChange = (e) => {
    this.setState({
      outStock: e.value
    })
  }

  handleSubmit = (part) => {
    const record = {
      ...part,
      inStock: this.props.inStock,
      outStock: this.state.outStock
    }
    ajax(`/api/transfer/${this.props.params.recordId}`, {
      data: JSON.stringify(record),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      // 更新缓存中的数据
      this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record: res.data.record })
      this.props.router.push(`transfer_order/${res.data.record._id}`)
    }).catch(err => {
      alert('出错了' + JSON.stringify(err));
    });
  }

  render() {
    const id = this.props.params.recordId
    const record = this.props.recordIdMap[id]
    const projectIdMap = this.props.projectIdMap

    if (!record || !projectIdMap) {
      return (
        <div className="alert alert-info">
          <p>请求数据中，请稍后</p>
        </div>
      )
    }

    return (
      <Transfer
        record={record}
        orderName="调拨入库单"
        stock={record.outStock}
        onSubmit={this.handleSubmit}
        onProjectChange={this.handleProjectChange}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    ...transformArticle(state.system.articles.toArray()),
    recordIdMap: state.store.records.toObject(),
    projectIdMap: state.system.projects.toObject(),
    projects: state.system.projects.toArray(),
    articles: state.system.articles.toArray(),
    base: state.system.base
  }
}

export default connect(mapStateToProps)(TransferInEdit)
