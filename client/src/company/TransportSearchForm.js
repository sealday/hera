/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { FilterSelect, DatePicker, Input } from '../components'
import { connect } from 'react-redux'
import moment from 'moment'
import { filterOption, transformArticle } from '../utils'

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
    const { handleSubmit, projects, startDate, endDate, reset } = this.props
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
            <a href="#" onClick={e => {
              e.preventDefault()
              this.props.change('startDate', moment().startOf('year'))
              this.props.change('endDate', moment().startOf('day'))
            }} style={{paddingTop: '7px', display: 'inline-block'}}>今年</a>
            <a href="#" onClick={e => {
              e.preventDefault()
              this.props.change('startDate', moment().startOf('day').add('month', -1))
              this.props.change('endDate', moment().startOf('day'))
            }} style={{paddingTop: '7px', display: 'inline-block', marginLeft: '1em'}}>最近一个月</a>
            <a href="#" onClick={e => {
              e.preventDefault()
              this.props.change('startDate', moment().startOf('day').add('month', -2))
              this.props.change('endDate', moment().startOf('day'))
            }} style={{paddingTop: '7px', display: 'inline-block', marginLeft: '1em'}}>两个月</a>
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
        </div>
      </form>
    )
  }
}

SimpleSearchForm = reduxForm({
  form: 'simpleSearchForm',
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
    articles,
    ...transformArticle(articles),
  }
}

SimpleSearchForm = connect(mapStateToProps)(SimpleSearchForm)

export default SimpleSearchForm
