import React from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  FilterSelect,
  DatePicker,
  Input,
  DateRangeModifier,
} from '../../components'
import { filterOption, transformArticle, wrapper } from '../../utils'

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
    const { handleSubmit, projects, startDate, endDate } = this.props
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
      </form>
    )
  }
}

const selector = formValueSelector('TransportSearchForm')
const mapStateToProps = state => { const articles = state.system.articles.valueSeq().toArray()
  return {
    projects: state.system.projects.valueSeq().toArray(),
    startDate: selector(state, 'startDate'),
    endDate: selector(state, 'endDate'),
    name: selector(state, 'name'),
    articles,
    ...transformArticle(articles),
  }
}

export default wrapper([
  reduxForm({
    form: 'TransportSearchForm',
    initialValues: {
      startDate: moment().startOf('day'),
      endDate: moment().startOf('day')
    }
  }),
  connect(mapStateToProps),
  SimpleSearchForm,
])
