/**
 * Created by xin on 2017/2/17.
 */

import {reduxForm, Field} from 'redux-form'
import React,{Component} from 'react'
import {DatePicker, FilterSelect,Input} from '../components';
import moment from 'moment';


class AccountVoucherInputForm extends Component{

    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit} className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="" className="control-label col-md-1">凭证编号</label>
                        <div className="col-md-2">
                            <Field name="voucher" component={Input}/>
                        </div>
                        <label htmlFor="" className="control-label col-md-1">日期</label>
                        <div className="col-md-2">
                            <Field name="date" component={DatePicker}/>
                        </div>
                        <label htmlFor="" className="control-label col-md-1">附件</label>
                        <div className="col-md-2">
                            <Field name="attachment" component={Input}/>
                        </div>
                        <label htmlFor="" className="control-label">张</label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="" className="control-label col-md-1">科目</label>
                        <div className="col-md-2">
                            <Field name="subject" component={Input}/>
                        </div>
                        <label htmlFor="" className="control-label col-md-1">借方金额</label>
                        <div className="col-md-2">
                            <Field name="borrowmoney" component={Input}/>
                        </div>
                        <label htmlFor="" className="control-label col-md-1">贷方金额</label>
                        <div className="col-md-2">
                            <Field name="loanmoney" component={Input}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="" className="control-label col-md-1">单价</label>
                        <div className="col-md-2">
                            <Field name="price" component={Input}/>
                        </div>
                        <label htmlFor="" className="control-label col-md-1">数量</label>
                        <div className="col-md-2">
                            <Field name="number" component={Input}/>
                        </div>
                        <label htmlFor="" className="control-label col-md-1">合计</label>
                        <div className="col-md-2">
                            <Field name="total" component={Input}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="control-label col-md-1">项目</label>
                        <div className="col-md-4">
                            <select className="form-control">
                                <option>项目</option>
                            </select>
                        </div>

                        <label htmlFor="" className="control-label col-md-1">部门</label>
                        <div className="col-md-3">
                            <select className="form-control">
                                <option>部门</option>
                                <option>部门</option>
                                <option>部门</option>
                            </select>
                        </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className="control-label col-md-1">摘要</label>
                            <div className="col-md-8">
                                <Field name="abstract" component={Input}/>
                            </div>
                        </div>
                    <div className="col-md-9">
                        <button className="btn btn-primary btn-block">提交</button>
                    </div>
                </form>
            </div>
        )

    }

}

AccountVoucherInputForm = reduxForm({
    form:"AccountVoucherInputForm",
    initialValues:{
        date:moment()
    }
})(AccountVoucherInputForm)
export default AccountVoucherInputForm