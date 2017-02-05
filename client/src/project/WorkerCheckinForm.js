/**
 * Created by wangjiabao on 2017/1/29.
 */

import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form'
import {Input, DatePicker, Select, FilterSelect} from '../components';
import moment from 'moment';
import {validator} from '../utils'
class WorkerCheckinForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgFile: {
                file: '',
                imagePreviewUrl: ''
            }
        }
    }

    handleLoadPic = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onload = () => {
            this.setState({
                imgFile: {
                    file: file,
                    imagePreviewUrl: reader.result
                }
            });
        }
        reader.readAsDataURL(file);

    };

    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit} className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">姓名</label>
                        <div className="col-md-3">
                            <Field name="name" component={Input} validate={validator.required}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">性别</label>
                        <div className="col-md-3">
                            <Field name="gender" component={Input} validate={validator.required}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">年龄</label>
                        <div className="col-md-3">
                            <Field component={Input} name="age" validate={validator.isNum }/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">工种</label>
                        <div className="col-md-3">
                            <Field component={Input} name="category" validate={validator.required}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">出生年月</label>
                        <div className="col-md-3">
                            <Field name="birthday" component={DatePicker} validate={validator.required}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">联系电话</label>

                        <div className="col-md-3">
                            <Field component={Input} name="phone" validate={validator.required}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">身份证号</label>
                        <div className="col-md-3">
                            <Field component={Input} name="idcard" validate={validator.required}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">进场时间</label>
                        <div className="col-md-3">
                            <Field component={DatePicker} name="jointime" validate={validator.required}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">家庭住址</label>
                        <div className="col-md-5">
                            <Field component={Input} name="address" validate={validator.required}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">所属项目</label>
                        <div className="col-md-5">
                            <Field
                                name="project"
                                component={FilterSelect}
                                validate={validator.required}
                                options={this.props.projects.map(project => ({
                                    value: project._id,
                                    label: project.company + project.name
                                }))}
                                placeholder="请选择项目"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">身份证照片</label>
                        <div className="col-md-5">
                            <input type="file" className="form-control" onChange={this.handleLoadPic}/>
                        </div>
                        <div className="col-md-6">
                            {this.state.imgFile.imagePreviewUrl &&
                            <img className="img-responsive" src={this.state.imgFile.imagePreviewUrl} alt=""/>}
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-md-12">
                            <button className="btn btn-primary btn-block">提交</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
WorkerCheckinForm = reduxForm({
    form: 'WorkerCheckinForm',
    initialValues: {
        birthday: moment(),
        jointime: moment()
    }
})(WorkerCheckinForm)

export default WorkerCheckinForm