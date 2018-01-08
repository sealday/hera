/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { FilterSelect, DatePicker, Input } from '../components'
import { connect } from 'react-redux'
import moment from 'moment'
import { filterOption } from '../utils'

/**
 * 搜索用的表单
 */
class SimpleSearchForm extends React.Component {

  getStockOptions = projects => {
    return [].concat(projects.filter(project => project.type !== '基地仓库').map(project => ({
      value: project._id,
      label: project.company + project.name,
      pinyin: project.pinyin
    })))
  }

  render() {
    const { handleSubmit, projects, startDate, endDate, reset } = this.props
    return (
      <form onSubmit={handleSubmit} className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-1">项目部</label>
          <div className="col-md-5">
            <Field name="project"
                   component={FilterSelect}
                   placeholder="请选择要计算的项目部"
                   options={this.getStockOptions(projects)}
                   filterOption={filterOption}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">开始日期</label>
          <div className="col-md-2">
            <Field name="startDate"
                   component={DatePicker}
                   selectsStart
                   startDate={startDate}
                   endDate={endDate}
            />
          </div>
          <label className="control-label col-md-1">结束日期</label>
          <div className="col-md-2">
            <Field name="endDate"
                   component={DatePicker}
                   selectsEnd
                   startDate={startDate}
                   endDate={endDate}
            />
          </div>
          <div className="col-md-6">
            <a href="#" onClick={e => {
              e.preventDefault()
              this.props.change('startDate', moment().startOf('year'))
              this.props.change('endDate', moment().startOf('day'))
            }} style={{paddingTop: '7px', display: 'inline-block'}}>今年</a>
            <a href="#" onClick={e => {
              e.preventDefault()
              this.props.change('startDate', moment().startOf('day').subtract(1, 'month'))
              this.props.change('endDate', moment().startOf('day'))
            }} style={{paddingTop: '7px', display: 'inline-block', marginLeft: '1em'}}>最近一个月</a>
            <a href="#" onClick={e => {
              e.preventDefault()
              this.props.change('startDate', moment().startOf('day').subtract(2, 'month'))
              this.props.change('endDate', moment().startOf('day'))
            }} style={{paddingTop: '7px', display: 'inline-block', marginLeft: '1em'}}>两个月</a>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-offset-6 col-md-2">
            <button type="submit" className="btn btn-primary btn-block">查询</button>
          </div>
          <div className="col-md-2">
            <button type="reset" className="btn btn-primary btn-block" onClick={() => reset()}>重置</button>
          </div>
        </div>
      </form>
    )
  }
}

SimpleSearchForm = reduxForm({
  form: 'rentCalcForm',
  initialValues: {
    startDate: moment().startOf('day'),
    endDate: moment().startOf('day')
  }
})(SimpleSearchForm)


const selector = formValueSelector('rentCalcForm')
const mapStateToProps = state => {
  return {
    projects: state.system.projects.toArray(),
    startDate: selector(state, 'startDate'),
    endDate: selector(state, 'endDate'),
  }
}

SimpleSearchForm = connect(mapStateToProps)(SimpleSearchForm)

export default SimpleSearchForm
