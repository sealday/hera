/**
 * Created by xin on 2017/2/18.
 */

import {reduxForm,Field} from 'redux-form'
import React,{Component} from 'react'
import {DatePicker} from '../components';
import moment from 'moment';




class PayAblesForm extends Component{
    render(){
        return(
            <div>
                <form className="form-horizontal" onSubmit={this.props.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="" className="control-label col-md-1">开始日期</label>
                        <div className="col-md-2">
                            <Field name="startDate" component={DatePicker}/>
                        </div>
                        <label htmlFor="" className="control-label col-md-1">结束日期</label>
                        <div className="col-md-2">
                            <Field name="endDate" component={DatePicker}/>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-primary btn-block">查询</button>

                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

PayAblesForm = reduxForm({
    form:'PayCheckForm',
    initialValues:{
        startDate:moment(),
        endDate:moment()
    }
})(PayAblesForm)

export default PayAblesForm

