/**
 * Created by seal on 11/01/2017.
 */

import React, { Component } from 'react';
import { ajax, transformArticle } from '../utils';
import { connect } from 'react-redux'

import Transfer from './Transfer'

class TransferOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inStock: '', // 调出进入的仓库
    };
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
    ajax('/api/transfer', {
      data: JSON.stringify(record),
      method: 'POST',
      contentType: 'application/json'
    }).then(res => {
      this.props.router.push(`transfer_order/${res.data.record._id}`)
    }).catch(err => {
      alert('出错了' + JSON.stringify(err));
    });
  }

  render() {
    return (
      <Transfer orderName="调拨出库单" stock={this.state.inStock} onSubmit={this.handleSubmit} onProjectChange={this.handleProjectChange} {...this.props} />
    )
  }
}

const mapStateToProps = state => {
  return {
    outStock: state.system.base._id,
    ...transformArticle(state.system.articles.toArray()),
    projects: state.system.projects.toArray()
  }
}

export default connect(mapStateToProps)(TransferOut)
