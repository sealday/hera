/**
 * Created by wangjiabao on 2017/1/24.
 */
import React, {Component} from 'react';
import {reduxForm,Field} from 'redux-form'
import {Input,DatePicker} from '../components';
import moment from 'moment';


class WorkerCheckin extends Component{
    constructor(props){
        super(props)
        this.state = {
            infolist:[]
        }
    }


    handleSubmit=(data)=>{
        this.setState(preState=>({
            infolist:preState.infolist.concat(data)
        }))

    }
    render(){
        return (
            <div>
                <WorkerCheckinForm
                onSubmit={this.handleSubmit}
                />
                <InfoList infolist = {this.state.infolist}/>
            </div>
        )
    }
}
const InfoList = (props)=>(
    <table className="table">
        <thead>
        <tr>
            <th>姓名</th>
            <th>性别</th>
            <th>年龄</th>
            <th>工种</th>
            <th>出生年月</th>
            <th>联系电话</th>
            <th>身份证号</th>
            <th>家庭住址</th>
        </tr>
        </thead>
        <tbody>
        {props.infolist.map(info=>(
            <tr key={info.idcard}>
                <td>{info.username}</td>
                <td>{info.age}</td>
                <td>{info.sex}</td>
                <td>{info.phonenumber}</td>
                <td>{info.workcategory}</td>
                <td>{moment(info.date).format('YYYY-MM-DD')}</td>
                <td>{info.idcard}</td>
                <td>{info.address}</td>
            </tr>
        ))}
        </tbody>
    </table>
)

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
                <h2>劳务人员进场登记</h2>
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">姓名</label>
                        <div className="col-md-3">
                            <Field name="username" component={Input} />
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">性别</label>
                        <div className="col-md-3">
                            <Field  name="sex"component={Input} />
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">年龄</label>
                        <div className="col-md-3">
                            <Field  component={Input} name="age" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="" className="col-md-1 control-label">工种</label>
                        <div className="col-md-3">
                            <Field  component={Input} name="workcategory" />
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">出生年月</label>
                        <div className="col-md-3">
                            <Field name="date"  component={DatePicker}/>
                        </div>
                        <label htmlFor="" className="col-md-1 control-label">联系电话</label>

                        <div className="col-md-3">
                            <Field  component={Input} name="phonenumber" />
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
                <button className="btn btn-primary btn-block">提交</button>
                </form>
            </div>
        )
    }
}
WorkerCheckinForm = reduxForm({
    form:'WorkerCheckinForm',
    initialValues:{
        date:moment()
    }
})(WorkerCheckinForm)
export default WorkerCheckin;
