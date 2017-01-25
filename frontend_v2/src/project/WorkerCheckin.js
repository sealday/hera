/**
 * Created by wangjiabao on 2017/1/24.
 */
import React, {Component} from 'react';
import {ajax} from '../utils';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import InputForm from '../store/InputForm';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {connect} from 'react-redux'

class WorkerCheckin extends Component {
    constructor(props) {
        super(props);
        this.state={
            date:moment(),
            imgFile:{
               file:'',
               imagePreviewUrl:''
           }
        }
    }

    handleDateChange=(date)=>{
        this.setState({
            date:date
        })
        }

    handleChange=(e)=>{
        if (e.target.name){
            this.setState({
                [e.target.name]:e.target.value
            });
        }
    }
    handleSubmit=(e)=>{        e.preventDefault();

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
        let {imagePreviewUrl} = this.state.imgFile;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} />);
        }

        return (

            <div>
                <form onSubmit={this.handleSubmit}>
                <h2>劳务人员进场登记</h2>
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">姓名</label>
                        <div className="col-md-3">
                            <input type="text" name="name" className="form-control" onChange={this.handleChange}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">性别</label>
                        <div className="col-md-3">
                            <input type="text" className="form-control" name="sex" onChange={this.handleChange}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">年龄</label>
                        <div className="col-md-3">
                            <input type="text" className="form-control" name="age" onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">工种</label>
                        <div className="col-md-3">
                            <input type="text" className="form-control" name="workcategory" onChange={this.handleChange}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">出生年月</label>
                        <div className="col-md-3">
                            <DatePicker selected={this.state.date} className="form-control" onChange={this.handleDateChange}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">联系电话</label>

                        <div className="col-md-3">
                            <input type="tel" className="form-control" name="phonenumber" onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">身份证号</label>
                        <div className="col-md-3">
                            <input type="number" className="form-control" name="idcard" onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">家庭住址</label>
                        <div className="col-md-5">
                            <input type="text" className="form-control" name="address" onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">身份证照片</label>
                        <div className="col-md-5">
                            <input type="file" className="form-control" onChange={this.handleLoadPic}/>
                            {$imagePreview}
                        </div>
                    </div>

                </div>
                <button className="btn btn-primary btn-block">提交</button>
                </form>
            </div>
        )
    }
}

export default WorkerCheckin;
