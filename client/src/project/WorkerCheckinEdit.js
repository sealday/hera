/**
 * Created by wangjiabao on 2017/1/29.
 */

import React, { Component } from 'react'
import WorkerCheckinForm from './WorkerCheckinForm'
import { connect } from 'react-redux'
import moment from 'moment';
import {alterWorker} from '../actions'

class WorkerCheckinEdit extends Component {

    handleSubmit = worker => {
        worker._id = this.props.params.id
        this.props.dispatch(alterWorker(worker))
    }

    render() {
        return (
            <div>
                <h2>劳务人员进场登记编辑</h2>
                <WorkerCheckinForm
                    onSubmit={this.handleSubmit}
                    initialValues={{...this.props.worker,birthday:moment(this.props.worker.birthday),jointime:moment(this.props.worker.jointime)}}
                />
            </div>
        )

    }

}

const mapStateToProps = (state,props)=>{
  let workers = state.requestWorkerlist.data;
  let worker =  workers.filter(worker=>{
      return worker._id === props.params.id;
  })
    return {
        worker:worker[0]
    }
}
export default connect(mapStateToProps)(WorkerCheckinEdit)