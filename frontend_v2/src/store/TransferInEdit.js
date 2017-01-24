/**
 * Created by seal on 16/01/2017.
 */

import React, { Component } from 'react';
import { ajax, transformArticle } from '../utils';
import { connect } from 'react-redux'

import Transfer from './Transfer'

class TransferInEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outStock: '', // 调入出去的仓库
      loading: true
    };
  }

  componentDidMount() {
    const id = this.props.params.recordId
    const record = this.props.recordIdMap[id]
    const projectIdMap = this.props.projectIdMap

    // 假设本地缓存中没有则进行一次网络请求
    if (!record || !projectIdMap) {
      ajax(`/api/transfer/${id}`).then(res => {
        const record = res.data.record
        this.props.dispatch({ type: 'UPDATE_RECORDS_CACHE', record })
        this.setState({
          loading: false,
          outStock: record.outStock
        })
      }).catch(err => {
        alert('请求调拨单失败，请尝试刷新页面' + JSON.stringify(err))
      })
    } else {
      this.setState({
        loading: false,
        outStock: record.outStock
      })
    }
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

    if (this.state.loading) {
      return (
        <div className="alert alert-info">
          <p>请求数据中，请稍后</p>
        </div>
      )
    }

    const id = this.props.params.recordId
    const record = this.props.recordIdMap[id]

    return (
      <Transfer record={record} orderName="调拨入库单" stock={this.state.outStock} onSubmit={this.handleSubmit} onProjectChange={this.handleProjectChange} {...this.props} />
    )
  }
}

const mapStateToProps = state => {
  const props = transformArticle(state.articles)
  const bases = state.projects.projects.filter(project => project.type === '基地仓库')
  const inStock = bases.length > 0 ? bases[0]._id : ''
  return {
    ...props,
    inStock,
    recordIdMap: state.projects.recordIdMap,
    projectIdMap: state.projects.projectIdMap,
    projects: state.projects.projects
  }
}

export default connect(mapStateToProps)(TransferInEdit)
