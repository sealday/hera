/**
 * Created by wangjiabao on 2017/1/29.
 */

import React, {Component} from 'react';
import {reduxForm,Field} from 'redux-form'
import {Input,DatePicker} from '../components';
import moment from 'moment';
class WorkerCheckinForm extends Component {
    constructor(props) {
        super(props);
        this.state={
            imgFile:{
                file:'',
                imagePreviewUrl:''
            }
        }
    }
    handleLoadPic = (e)=>{
        e.preventDefault();
        let reader = new FileReader();
        let file =e.target.files[0];
        reader.onload = ()=>{
            this.setState({
                imgFile:{
                    file:file,
                    imagePreviewUrl:reader.result
                }
            });
        }
        reader.readAsDataURL(file);

    };
    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSubmit}>
                    <div className="form-horizontal">
                        <div className="form-group">
                            <label htmlFor="" className="col-md-1 control-label">姓名</label>
                            <div className="col-md-3">
                                <Field name="name" component={Input} />
                            </div>
                            <label htmlFor="" className="col-md-1 control-label">性别</label>
                            <div className="col-md-3">
                                <Field  name="gender"component={Input} />
                            </div>
                            <label htmlFor="" className="col-md-1 control-label">年龄</label>
                            <div className="col-md-3">
                                <Field  component={Input} name="age" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className="col-md-1 control-label">工种</label>
                            <div className="col-md-3">
                                <Field  component={Input} name="category" />
                            </div>
                            <label htmlFor="" className="col-md-1 control-label">出生年月</label>
                            <div className="col-md-3">
                                <Field name="birthday"  component={DatePicker} />
                            </div>
                            <label htmlFor="" className="col-md-1 control-label">联系电话</label>

                            <div className="col-md-3">
                                <Field  component={Input} name="phone" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className="col-md-1 control-label">身份证号</label>
                            <div className="col-md-3">
                                <Field  component={Input} name="idcard" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className="col-md-1 control-label">家庭住址</label>
                            <div className="col-md-5">
                                <Field  component={Input} name="address" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="" className="col-md-1 control-label">身份证照片</label>
                            <div className="col-md-5">
                                <input type="file" className="form-control" onChange={this.handleLoadPic}/>
                                {this.state.imgFile.imagePreviewUrl && <img src={this.state.imgFile.imagePreviewUrl} alt=""/>}
                            </div>
                        </div>

                    </div>
                  <div className="form-group">
                    <button className="btn btn-primary btn-block">提交</button>
                  </div>
                </form>
            </div>
        )
    }
}
WorkerCheckinForm = reduxForm({
    form:'WorkerCheckinForm',
    initialValues:{
        birthday:moment()
    }
})(WorkerCheckinForm)

export default WorkerCheckinForm