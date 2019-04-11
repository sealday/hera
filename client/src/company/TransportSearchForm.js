import React from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  FilterSelect,
  DatePicker,
  Input,
  DateRangeModifier,
} from '../components'
import { filterOption, transformArticle } from '../utils'
import { fetchAllPayer } from '../actions'

class SimpleSearchForm extends React.Component {

  defaultOption = {
    value: '',
    label: '全部',
    pinyin: 'quanbu'
  }

  getStockOptions = projects => {
    return [this.defaultOption].concat(projects.map(project => ({
      value: project._id,
      label: project.company + project.name,
      pinyin: project.pinyin
    })))
  }

  getPayerOptions = (payers) => {
    return [this.defaultOption].concat(payers.map((payer) => ({
      value: payer.name,
      label: payer.name,
      pinyin: payer.pinyin,
    })))
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchAllPayer())
  }

  render() {
    const { handleSubmit, projects, startDate, endDate, reset, payers } = this.props
    return (
      <form onSubmit={handleSubmit} className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-1">项目部</label>
          <div className="col-md-5">
            <Field name="other"
                   component={FilterSelect}
                   placeholder="仓库"
                   options={this.getStockOptions(projects)}
                   filterOption={filterOption}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">付款方</label>
          <div className="col-md-5">
            <Field name="payer"
                   component={FilterSelect}
                   placeholder="付款方"
                   options={this.getPayerOptions(payers)}
                   filterOption={filterOption}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">收款人</label>
          <div className="col-md-5">
            <Field name="payee" className="form-control" component={Input} />
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
            <DateRangeModifier
              change={this.props.change}
              key_start="startDate"
              key_end="endDate"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">车号</label>
          <div className="col-md-2">
            <Field name="carNumber" className="form-control" component={Input} />
          </div>
          <label className="control-label col-md-1">单号</label>
          <div className="col-md-2">
            <Field name="number" className="form-control" component={Input} />
          </div>
          <label className="control-label col-md-1">原始单号</label>
          <div className="col-md-2">
            <Field name="originalOrder" className="form-control" component={Input} />
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-offset-6 col-md-2">
            <button type="submit" className="btn btn-primary btn-block">查询</button>
          </div>
          <div className="col-md-2">
            <button type="reset" className="btn btn-primary btn-block" onClick={e => reset()}>重置</button>
          </div>
          {this.props.onExcelExport && <div className="col-md-2">
            <button type="button" className="btn btn-primary btn-block" onClick={e => this.props.onExcelExport() }>导出excel</button>
          </div>}
        </div>
      </form>
    )
  }
}

SimpleSearchForm = reduxForm({
  form: 'companyTransportSearchForm',
  initialValues: {
    startDate: moment().startOf('day'),
    endDate: moment().startOf('day')
  }
})(SimpleSearchForm)


const selector = formValueSelector('simpleSearchForm')
const mapStateToProps = state => {
  const articles = state.system.articles.toArray()
  return {
    projects: state.system.projects.toArray(),
    startDate: selector(state, 'startDate'),
    endDate: selector(state, 'endDate'),
    name: selector(state, 'name'),
    payers: state.results.get('payers', []),
    articles,
    ...transformArticle(articles),
  }
}

SimpleSearchForm = connect(mapStateToProps)(SimpleSearchForm)

export default SimpleSearchForm
