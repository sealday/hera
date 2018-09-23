import React from 'react'
import Button from '@material-ui/core/Button'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import moment from 'moment'
import { connect } from 'react-redux'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { withStyles } from '@material-ui/core/styles'

import { FilterSelect, DatePicker } from '../components'
import { filterOption, validator } from '../utils'
import { PRICE_PLAN, queryPricePlan } from '../actions'

const styles = {
  rangeFirst: {
    paddingTop: '7px',
    display: 'inline-block',
  },
  range: {
    paddingTop: '7px',
    display: 'inline-block',
    marginLeft: '1em'
  },
}

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

  getPlanOptions = (plans) => {
    return [].concat(plans.map((plan) => ({
      value: plan._id,
      label: plan.name,
      pinyin: ''
    })))
  }

  changeRange = (start, end) => e => {
    e.preventDefault()
    this.props.change('startDate', start.startOf('day'))
    this.props.change('endDate', end.startOf('day'))
  }

  componentDidMount() {
    this.props.dispatch(queryPricePlan())
  }

  render() {
    const { handleSubmit, projects, startDate, endDate, reset, onAddItem, title, onExcelExport, classes } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <CardHeader
          title={title}
          action={
            [
              <Button key={0} type="submit">查询</Button>,
              <Button key={1} type="reset" onClick={() => reset()}>重置</Button>,
              onExcelExport &&
              <Button key={2} type="button" onClick={onExcelExport}>导出excel</Button>,
              <Button key={4} type="button" onClick={handleSubmit(onAddItem)}>生成对账单</Button>,
            ]
          }
        />
        <CardContent>
          <div className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-md-1">项目部</label>
              <div className="col-md-5">
                <Field name="project"
                       component={FilterSelect}
                       placeholder="请选择要计算的项目部"
                       options={this.getStockOptions(projects)}
                       validate={[validator.required]}
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
                <a href="#"
                   onClick={this.changeRange(moment().startOf('year'), moment())}
                   className={classes.rangeFirst}>今年</a>
                <a href="#"
                   onClick={
                     this.changeRange(
                       moment(startDate).subtract(1, 'year').startOf('year'),
                       moment(startDate).subtract(1, 'year').endOf('year'))
                   }
                   className={classes.range}>上一年</a>
                <a href="#"
                   onClick={
                     this.changeRange(
                       moment(startDate).add(1, 'year').startOf('year'),
                       moment(startDate).add(1, 'year').endOf('year'))
                   }
                   className={classes.range}>下一年</a>
                <a href="#"
                   onClick={this.changeRange(moment().subtract(1, 'month'), moment())}
                   className={classes.range}>最近一个月</a>
                <a href="#"
                   onClick={this.changeRange(moment().subtract(2, 'month'), moment())}
                   className={classes.range}>两个月</a>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-1">价格方案</label>
              <div className="col-md-5">
                <Field name="planId"
                       component={FilterSelect}
                       placeholder="请选择要使用的价格方案"
                       validate={[validator.required]}
                       options={this.getPlanOptions(this.props.plans)}
                       filterOption={filterOption}
                />
              </div>
            </div>
          </div>
        </CardContent>
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
  const plans = state.results.get(PRICE_PLAN, [])

  return {
    projects: state.system.projects.toArray(),
    startDate: selector(state, 'startDate'),
    endDate: selector(state, 'endDate'),
    plans: plans,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(SimpleSearchForm))
