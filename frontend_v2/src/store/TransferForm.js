/**
 * Created by seal on 25/01/2017.
 */

//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form'
import { Input, DatePicker, FilterSelect, Select } from '../components'
import { connect } from 'react-redux'
import { calculateSize, transformArticle } from '../utils'
import moment from 'moment'

const EntryTable = ({ fields }) => (
  <table className="table table-bordered" onKeyDown={e => {
    if (e.key == 'Enter') {
      fields.push({})
    }
  }}  >
    <thead>
    <tr>
      <th>类型</th>
      <th>名称</th>
      <th>规格</th>
      <th>数量</th>
      <th>小计</th>
      <th><button type="button" onClick={() => fields.push({})}>Add Member</button></th>
    </tr>
    </thead>
    <tbody>
    {fields.map((entry, index) =>
      <tr key={index}>
        <td><Field name={`${entry}.type`} component={(props) => <Select {...props}>
          <option>租赁类</option>
          <option>工具类</option>
          <option>消耗类</option>
        </Select>} /></td>
        <td><Field name={`${entry}.name`} component={Input}/></td>
        <td><Field name={`${entry}.size`} component={Input}/></td>
        <td><Field name={`${entry}.count`} component={Input}/></td>
        <td>--</td>
        <td>
          <button
            type="button"
            onClick={() => fields.remove(index)}>删除 </button>
        </td>
      </tr>
    )}
    </tbody>
  </table>
)


class TransferForm extends Component {
  render() {
    return (
      <form className="form-horizontal" onSubmit={ e => {
        e.preventDefault()
        e.persist()
        console.dir(e)
        {/*this.props.handleSubmit(e)*/}
      }}>
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
        <div className="form-group">
          <div className="col-md-12">
            <FieldArray name="entries" component={EntryTable}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-12">
            <button type="submit">提交</button>
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
  projects: state.system.projects.toArray(),
  ...transformArticle(state.system.articles.toArray()),
})


export default connect(mapStateToProps)(TransferForm);