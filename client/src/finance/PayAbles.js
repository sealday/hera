/**
 * Created by xin on 2017/2/17.
 */

import React, { Component } from 'react'
import PayAblesForm from './PayAblesForm'
import { payables } from '../actions'
import { connect } from 'react-redux'
import { toFixedWithoutTrailingZero as fixed } from '../utils'
import { Link } from 'react-router'
import moment from 'moment'


class PayAbles extends Component {

  handleSubmit = condition => {
    this.props.dispatch(payables({
      ...condition,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    return (
      <div>
        <h2>
          应付账款
        </h2>
        <PayAblesForm onSubmit={this.handleSubmit}/>
        <InfoList payables={this.props.payables}/>
      </div>
    )
  }
}


const InfoList = (props)=> (
  <table className="table table-bordered">
    <thead>
    <tr>
      <td>流水号</td>
      <td>对方单位</td>
      <td>总账科目</td>
      <td>明细科目</td>
      <td>费用</td>
      <td/>
    </tr>
    </thead>
    <tbody>
    {

      props.payables.map(payable=>(

        <tr key={payable._id}>
          <td>{payable.number}</td>
          <td>{payable.vendor}</td>
          <td>{payable.first}</td>
          <td>{payable.second}</td>
          <td>{fixed(payable.sum)}</td>
          {payable.sourceType === '采购' && <td><Link to={'/record/' + payable.sourceId}>查看原始单据</Link></td> }
          {payable.sourceType === '运输' && <td><Link to={'/transport/' + payable.sourceId}>查看原始单据</Link></td> }
        </tr>

      ))
    }
    </tbody>
  </table>
)

const mapStateToProps = state => {
  return {
    payables: state.payables.payables
  }
}

export default connect(mapStateToProps)(PayAbles)

