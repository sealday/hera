/**
 * Created by xin on 2017/2/16.
 */
import {reduxForm, Field} from 'redux-form'
import React,{Component} from 'react'
import {DatePicker, FilterSelect} from '../components';
import moment from 'moment';


class DisplaySigninForm extends Component{

    render() {
        return(
            <div>
                <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                    <div className="col-md-9 form-group">
                        <label className="col-md-1 control-label">日期范围</label>
                        <div className="col-md-4">
                            <Field name="startDate" component={DatePicker} showYearDropdown
                                   dateFormatCalendar="MMMM"
                                   scrollableYearDropdown/>
                        </div>
                        <div className="col-md-4">
                            <Field name="endDate" component={DatePicker} showYearDropdown
                                   dateFormatCalendar="MMMM"
                                   scrollableYearDropdown/>
                        </div>
                    </div>
                    <div className="col-md-9 form-group">
                        <label htmlFor="" className="col-md-1 control-label">所属项目</label>
                        <div className="col-md-8">
                            <Field name="projects" component={FilterSelect} options={this.props.projects.map(project=>({
                                value: project._id,
                                label: project.company + project.name
                            }
                            ))} placeholder="请选择项目"/>
                        </div>
                    </div>
                    <div className="col-md-9 form-group">
                        <label htmlFor="" className="col-md-1 control-label">工人姓名</label>
                        <div className="col-md-6">
                            <Field name="workers" component={FilterSelect} options={this.props.workers.map(worker=>({
                                value: worker._id,
                                label: worker.name
                            }
                            ))} placeholder="请选择工人"/>
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

DisplaySigninForm = reduxForm({
    form:"DisplaySigninForm",
    initialValues:{
        startDate:moment(),
        endDate:moment()
    }
})(DisplaySigninForm)

export default DisplaySigninForm