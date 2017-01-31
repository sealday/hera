/**
 * Created by wangjiabao on 2017/1/24.
 */
import React, {Component} from 'react';
import moment from 'moment';
import WorkerCheckinForm from './WorkerCheckinForm'
import { connect } from 'react-redux'

import {postWorkerCheckin} from  '../actions';
class WorkerCheckin extends Component{
    constructor(props){
        super(props)

    }


    handleSubmit=(data)=>{

        this.props.dispatch(postWorkerCheckin(data));

    }
    render(){
        return (
            <div>
                <WorkerCheckinForm
                onSubmit={this.handleSubmit}
                />
                <InfoList infolist = {this.props.workers}/>
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
        {
            props.infolist.map(info=>(
            <tr key={info._id}>
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

const mapStateToProps = state =>{
    let w = state.postWorkerCheckin.data || [];
    return {
        workers:w
    }
}
export default connect(mapStateToProps)(WorkerCheckin)
