import React from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import moment from 'moment'
import { connect } from 'react-redux'

import {
  FilterSelect,
  DatePicker,
  Input,
  Select,
  DateRangeModifier,
} from '../../components'
import { filterOption, transformArticle, wrapper, RECORD_TYPES, DEFAULT_QUERY_TYPE } from '../../utils'
import _ from 'lodash'

/**
 * 搜索用的表单
 */
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

  getTypeOptions = () => {
    return [{
      value: '',
      label: '全部',
    }].concat(RECORD_TYPES.map(v => ({ value: v, label: v })))
  }

  getInOutOptions = () => {
    return [{
      value: '',
      label: '全部',
    }].concat(['出库', '入库'].map(v => ({ value: v, label: v })))
  }

  getNameOptions = () => {
    const articles = this.props.articles
    return [this.defaultOption].concat(articles.map(article => ({
      value: article.name,
      label: article.name,
      pinyin: article.pinyin
    })))
  }

  getSizeOptions() {
    if (this.props.name === '' || !this.props.nameArticleMap[this.props.name]) {
      return [this.defaultOption]
    } else {
      return [this.defaultOption].concat(this.props.nameArticleMap[this.props.name].sizes.map(size => (
        {
          value: size,
          label: size,
        }
      )))
    }
  }

  render() {
    const { handleSubmit, projects, startDate, endDate, other, isCompany } = this.props
    return (
      <form onSubmit={handleSubmit}>
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
          <label className="control-label col-md-1">类型</label>
          <div className="col-md-2">
            <Field name="type"
                   component={FilterSelect}
                   placeholder="类型"
                   options={this.getTypeOptions()}
            />
          </div>
          {(!isCompany || !!other) && <>
            <label className="control-label col-md-1">出入库</label>
            <div className="col-md-2">
              <Field name="inOut"
                component={FilterSelect}
                placeholder="出入库"
                options={this.getInOutOptions()}
              />
            </div>
          </>}
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
              current={startDate}
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
          <label className="control-label col-md-1">回单联</label>
          <div className="col-md-2">
            <Field name="receipt"
              component={Select}
            >
              <option>全部</option>
              <option>已签收</option>
              <option>未签收</option>
            </Field>
          </div>
          <label className="control-label col-md-1">存根联</label>
          <div className="col-md-2">
            <Field name="counterfoil"
              defaultValue='全部'
              component={Select}
            >
              <option>全部</option>
              <option>已签收</option>
              <option>未签收</option>
            </Field>
          </div>
        </div>
      </form>
    )
  }
}


const selector = formValueSelector('SimpleSearchForm')
const mapStateToProps = state => {
  const articles = state.system.articles.valueSeq().toArray()
  return {
    projects: state.system.projects.valueSeq().toArray(),
    startDate: selector(state, 'startDate'),
    other: selector(state, 'other'),
    endDate: selector(state, 'endDate'),
    name: selector(state, 'name'),
    articles,
    ...transformArticle(articles),
  }
}

export default wrapper([
  reduxForm({
    form: 'SimpleSearchForm',
    initialValues: {
      startDate: moment().startOf('day'),
      endDate: moment().startOf('day'),
      type: DEFAULT_QUERY_TYPE,
      counterfoil: '全部',
      receipt: '全部',
    }
  }),
  connect(mapStateToProps),
  SimpleSearchForm,
])
