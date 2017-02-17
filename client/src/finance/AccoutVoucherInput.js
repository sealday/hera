/**
 * Created by xin on 2017/2/17.
 */
import React, {Component} from 'react'
import AccountVoucherInputForm from './AccountVoucherInputForm'

class AccoutVoucherInput extends Component {
    handleSubmit = {}

    render() {
        return (
            <div>
                <h2>记账凭证</h2>
                <div className="col-md-9">
                    <AccountVoucherInputForm/>
                </div>
            </div>


        )

    }
}

export default AccoutVoucherInput
