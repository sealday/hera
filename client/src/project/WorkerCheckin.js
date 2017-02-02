/**
 * Created by wangjiabao on 2017/1/24.
 */
import React, {Component} from 'react';
import moment from 'moment';
import WorkerCheckinForm from './WorkerCheckinForm'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {postWorkerCheckin} from  '../actions';
import {requestWorkerlist} from '../actions'

class WorkerCheckin extends Component{

    componentDidMount() {
        this.props.dispatch(requestWorkerlist())
    }

    handleSubmit=(data)=>{
        this.props.dispatch(postWorkerCheckin(data));

    }
    render(){
        return (
            <div>
                <h2>劳务人员进场登记</h2>
                <WorkerCheckinForm
                onSubmit={this.handleSubmit}
                />
                <InfoList infolist={this.props.workers}/>
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
            <th>操作</th>
        </tr>
        </thead>
        <tbody>
        {
            props.infolist.map(info=>(
            <tr key={info._id}>
                <td>{info.name}</td>
                <td>{info.gender}</td>
                <td>{info.age}</td>
                <td>{info.category}</td>
                <td>{moment(info.birthday).format('YYYY-MM-DD')}</td>
                <td>{info.phone}</td>
                <td>{info.idcard}</td>
                <td>{info.address}</td>
                <td><Link to={`/worker/${info._id}/edit`}>编辑</Link><Link to={`/worker/${info._id}/edit`}>删除</Link></td>
            </tr>
        ))}
        </tbody>
    </table>
)

const mapStateToProps = state =>{
    let w = state.requestWorkerlist.data;
    return {
        workers:w
    }
}
export default connect(mapStateToProps)(WorkerCheckin)
