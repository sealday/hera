/**
 * Created by seal on 25/01/2017.
 */

import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form'
import { Input, DatePicker, FilterSelect } from '../components'
import { connect } from 'react-redux'
import moment from 'moment'

class TransferForm extends Component {
  render() {
    return (
      <form className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-1">项目部</label>
          <div className="col-md-3">
            <Field
              name="project"
              component={FilterSelect}
              options={this.props.projects.map(project => ({ value: project._id, label: project.company + project.name }))}
              placeholder="请选择项目" />
          </div>
          <label className="control-label col-md-1">日期</label>
          <div className="col-md-3">
            <Field name="outDate" component={DatePicker}/>
          </div>
          <label className="control-label col-md-1">原始单号</label>
          <div className="col-md-3">
            <Field name="originalOrder" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">车号</label>
          <div className="col-md-3">
            <Field name="carNumber" component={Input}/>
          </div>
          <label className="control-label col-md-1">运费</label>
          <div className="col-md-3">
            <Field name="fee.car" component={Input}/>
          </div>
          <label className="control-label col-md-1">备注</label>
          <div className="col-md-3">
            <Field name="comments" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">整理费用</label>
          <div className="col-md-3">
            <Field name="fee.sort" component={Input}/>
          </div>
          <label className="control-label col-md-1">其他费用1</label>
          <div className="col-md-3">
            <Field name="fee.other1" component={Input}/>
          </div>
          <label className="control-label col-md-1">其他费用2</label>
          <div className="col-md-3">
            <Field name="fee.other2" component={Input}/>
          </div>
        </div>
      </form>
    );
  }
}

TransferForm = reduxForm({
  form: 'transfer',
  initialValues: {
    outDate: moment()
  }
})(TransferForm)

const mapStateToProps = state => ({
  projects: state.system.projects.toArray()
})


export default connect(mapStateToProps)(TransferForm);