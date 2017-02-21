/**
 * Created by xin on 2017/2/14.
 */
import React, {Component} from 'react';
import moment from 'moment';
import {connect} from 'react-redux'
import  {requestWorkerlist } from '../actions'
import DisplaySigninForm from './DisplaySigninForm'


class DisplaySignin extends Component {
    componentDidMount(){
        this.props.dispatch(requestWorkerlist("displaysignin"))
    }

    handleSubmit = () =>{

    }

    constructor(props) {
        super(props);
        this.state = {
            date: moment(),
        };
    }

    render() {
        return (
            <div>
                <h2>签到查询</h2>
                <div>
                    <DisplaySigninForm
                        projects={this.props.projects}
                        workers={this.props.workers}
                        onSubmit={this.handleSubmit}
                    />
                </div>
                <div className="col-md-12 form-group">
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>工人名称</th>
                            <th>实际出勤（天）</th>
                            <th>迟到（次）</th>
                            <th>早退（次）</th>
                            <th>缺卡（次）</th>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {

    return {
        workers:state.requestWorkerlist.data,
        projects: state.system.projects.toArray()
    }
}

export default connect(mapStateToProps)(DisplaySignin)