/**
 * Created by seal on 11/01/2017.
 */

import React, { Component } from 'react';
import {  transformArticle } from '../utils';
import { connect } from 'react-redux'
import { postTransfer } from '../actions'

import Transfer from './Transfer'

class TransferIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outStock: '', // 调入出去的仓库
    };
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
    this.props.dispatch(postTransfer(record))
  }

  render() {
    return (
      <div>
        {this.props.postTransfer.posting && <p>请求中</p>}
        {this.props.postTransfer.data && <p>{this.props.postTransfer.data.record._id}</p>}
        <Transfer orderName="调拨入库单" stock={this.state.outStock} onSubmit={this.handleSubmit} onProjectChange={this.handleProjectChange} {...this.props} />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...transformArticle(state.system.articles.toArray()),
    inStock: state.system.base._id,
    projects: state.system.projects.toArray(),
    postTransfer: state.postTransfer
  }
}

export default connect(mapStateToProps)(TransferIn)
