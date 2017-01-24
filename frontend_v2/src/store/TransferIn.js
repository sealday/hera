/**
 * Created by seal on 11/01/2017.
 */

import React, { Component } from 'react';
import { ajax, transformArticle } from '../utils';
import { connect } from 'react-redux'

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
      <Transfer orderName="调拨入库单" stock={this.state.outStock} onSubmit={this.handleSubmit} onProjectChange={this.handleProjectChange} {...this.props} />
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
    projects: state.projects.projects
  }
}

export default connect(mapStateToProps)(TransferIn)
