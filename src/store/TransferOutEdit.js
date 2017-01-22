/**
 * Created by seal on 16/01/2017.
 */

import React, { Component } from 'react';
import { ajax, transformArticle } from '../utils';
import { connect } from 'react-redux'

import Transfer from './Transfer'

class TransferOutEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inStock: '', // 调出进入的仓库
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
          inStock: record.inStock
        })
      }).catch(err => {
        alert('请求调拨单失败，请尝试刷新页面' + JSON.stringify(err))
      })
    } else {
      this.setState({
        loading: false,
        inStock: record.inStock
      })
    }
  }

  handleProjectChange = (e) => {
    this.setState({
      inStock: e.value
    })
  }

  handleSubmit = (part) => {
    const record = {
      ...part,
      inStock: this.state.inStock,
      outStock: this.props.outStock
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
      <Transfer record={record} orderName="调拨出库单" stock={this.state.inStock} onSubmit={this.handleSubmit} onProjectChange={this.handleProjectChange} {...this.props} />
    )
  }
}

const mapStateToProps = state => {
  const props = transformArticle(state.articles)
  const bases = state.projects.projects.filter(project => project.type == '基地仓库')
  const outStock = bases.length > 0 ? bases[0]._id : ''
  return {
    ...props,
    outStock,
    recordIdMap: state.projects.recordIdMap,
    projectIdMap: state.projects.projectIdMap,
    projects: state.projects.projects
  }
}

export default connect(mapStateToProps)(TransferOutEdit)
