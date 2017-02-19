/**
 * Created by xin on 2017/2/17.
 */

import React, {Component} from 'react'
import PayAblesForm from './PayAblesForm'
import {payables} from '../actions'
import {connect} from 'react-redux'
import {total,toFixedWithoutTrailingZero} from '../utils'
import { Link } from 'react-router'


class PayAbles extends Component {

    handleSubmit = (data)=> {
        this.props.dispatch(payables(data))
    }

    render() {
        return (
            <div>
                <h2>
                    应付查询
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
            <td>总账科目</td>
            <td>明细科目</td>
            <td>费用</td>
            <td>状态</td>
        </tr>
        </thead>
        <tbody>
        {

            props.payables.map(payable=>(

                <tr key={payable._id}>
                    <td>{payable.number}</td>
                    <td>xxxx</td>
                    <td>材料费</td>
                    <td>{getTotalfee(payable.entries).totalmaterialfee}</td>
                    <td><Link to='finance/payabledetails'>详情</Link></td>
                </tr>

            ))
        }
        </tbody>
    </table>
)

function getTotalfee(entries) {
    let totalmaterialfee = 0;
    let totalcarfee = 0;
    entries.forEach(item=>{
        totalmaterialfee+=total(item.count,item.size)*item.price
        totalcarfee += Number(item.freightCount)* Number(item.freightPrice)
    })
    return {totalmaterialfee:toFixedWithoutTrailingZero(totalmaterialfee),totalcarfee:toFixedWithoutTrailingZero(totalcarfee)}
}
function getTotalCarfee(entries) {

}
const mapStateToProps = state => {
    return {
        payables: state.payables.payables
    }
}

export default connect(mapStateToProps)(PayAbles)

