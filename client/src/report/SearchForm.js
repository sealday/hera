/**
 * Created by seal on 31/01/2017.
 */

import React from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { FilterSelect, DatePicker, Input, Select } from '../components'
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
    const { handleSubmit, projects, startDate, endDate, reset } = this.props
    return (
      <form onSubmit={handleSubmit} className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-md-1">出库</label>
          <div className="col-md-2">
            <Field name="outStock" component={FilterSelect} placeholder="仓库" options={this.getStockOptions(projects)}
                   filterOption={filterOption}
            />
          </div>
          <label className="control-label col-md-1">入库</label>
          <div className="col-md-2">
            <Field name="inStock" component={FilterSelect} placeholder="仓库" options={this.getStockOptions(projects)}
                   filterOption={filterOption}
            />
          </div>
          <label className="control-label col-md-1">记录类型</label>
          <div className="col-md-2">
            <Field name="type"
                   component={Select}
                   placeholder="类型"
            >
              <option value=''>全部</option>
              <option>采购</option>
              <option>销售</option>
              <option>调拨</option>
            </Field>
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
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">名称</label>
          <div className="col-md-2">
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
          <label className="control-label col-md-1">规格</label>
          <div className="col-md-2">
            <Field name="size" component={FilterSelect} placeholder="规格"
                   options={this.getSizeOptions()}
            />
          </div>
          <label className="control-label col-md-1">数量范围</label>
          <div className="col-md-1">
            <Field name="startCount" className="form-control" component={Input}/>
          </div>
          <div className="col-md-1">
            <Field name="endCount" className="form-control" component={Input} />
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

TransferSearchForm = reduxForm({
  form: 'transferSearch',
  initialValues: {
    startDate: moment().startOf('day'),
    endDate: moment().startOf('day')
  }
})(TransferSearchForm)


const selector = formValueSelector('transferSearch')
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

TransferSearchForm = connect(mapStateToProps)(TransferSearchForm)

export default TransferSearchForm
