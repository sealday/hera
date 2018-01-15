import React from 'react'
import RentCalcForm from './RentCalcForm'
import RentCalcTable from './RentCalcTable'
import { connect } from 'react-redux'
import moment from 'moment'
import { queryRent } from '../actions'


class RentCalc extends React.Component {
  handleSubmit = (condition) => {
    this.props.dispatch(queryRent({
      ...condition,
      endDate: moment(condition.endDate).add(1, 'day')
    }))
  }

  render() {
    return (
      <div>
        <h3 className="page-header">租金计算</h3>
        <RentCalcForm onSubmit={this.handleSubmit}/>
        <RentCalcTable/>
      </div>
    )
  }
}

export default connect()(RentCalc)

