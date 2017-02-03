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
class TransferSearchForm extends React.Component {

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
    const labelStyle = width => ({
      width: width + 'em',
      textAlign: 'center',
    })

    const { handleSubmit, projects, startDate, endDate, reset, fieldname } = this.props
    return (
      <form onSubmit={handleSubmit} className="form-inline">
        <div className="form-group">
          <label className="control-label" style={labelStyle(2)}>{fieldname}</label>
          <Field
            name="other"
            style={{width: '26em'}}
            component={FilterSelect}
            placeholder="仓库"
            options={this.getStockOptions(projects)}
            filterOption={filterOption}
          />
        </div>
        <div className="form-group">
          <label className="control-label" style={labelStyle(4)}>开始日期</label>
          <Field
            name="startDate"
            component={DatePicker}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            style={{
              width: '8em'
            }}
          />
        </div>
        <div className="form-group">
          <label className="control-label" style={labelStyle(4)}>结束日期</label>
          <Field name="endDate"
                 component={DatePicker}
                 selectsEnd
                 startDate={startDate}
                 endDate={endDate}
          />
        </div>
        <div className="form-group">
          <label className="control-label" style={labelStyle(2)}>名称</label>
          <Field name="name" component={FilterSelect} placeholder="名称"
                 filterOption={filterOption}
                 options={this.getNameOptions()}
                 normalize={(value, previousValue) => {
                   if (previousValue !== value) {
                     this.props.change('size', '')
                   }
                   return value
                 }}
          />
        </div>
        <div className="form-group">
          <label className="control-label" style={labelStyle(2)}>规格</label>
          <Field name="size" component={FilterSelect} placeholder="规格"
                 options={this.getSizeOptions()}
          />
        </div>
        <div className="form-group">
          <label className="control-label" style={labelStyle(4)}>数量范围</label>
          <Field name="startCount" className="form-control" component={Input} style={{width: '6em'}}/>
          <span> - </span>
          <Field name="endCount" className="form-control" component={Input} style={{width: '6em'}} />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">查询</button>
        </div>
        <div className="form-group">
          <button type="reset" className="btn btn-primary" onClick={e => reset()}>重置</button>
        </div>
      </form>
    )
  }
}

TransferSearchForm = reduxForm({
  initialValues: {
    startDate: moment().startOf('year'),
    endDate: moment().startOf('day')
  }
})(TransferSearchForm)


const mapStateToProps = (state, props) => {
  const selector = formValueSelector(props.form)
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

TransferSearchForm = connect(mapStateToProps)(TransferSearchForm)

export default TransferSearchForm
