import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Button,
} from '@material-ui/core'

import {
  DatePicker,
  FilterSelect,
} from '../components'
import {
  filterOption
} from '../utils'

const StoreForm = ({ store, handleSubmit }) => (
  <form className="form-horizontal" onSubmit={handleSubmit}>
    <div className="form-group">
      <label className="control-label col-md-1">开始日期</label>
      <div className="col-md-2">
        <Field
          component={DatePicker}
          name="startDate"
        />
      </div>
      <label className="control-label col-md-1">结束日期</label>
      <div className="col-md-2">
        <Field
          component={DatePicker}
          name="endDate"
        />
      </div>
      <div className="col-md-6">
        <a href="#" onClick={e => {
          e.preventDefault()
          this.setState({
            startDate: moment().startOf('year').subtract(1, 'year'),
            endDate: moment().endOf('year').subtract(1, 'year').startOf('day'),
          })
        }} style={{paddingTop: '7px', display: 'inline-block'}}>上一年</a>
        <a href="#" onClick={e => {
          e.preventDefault()
          this.setState({
            startDate: moment().startOf('year'),
            endDate: moment().endOf('year').startOf('day'),
          })
        }} style={{paddingTop: '7px', display: 'inline-block', marginLeft: '1em'}}>今年</a>
        <a href="#" onClick={e => {
          e.preventDefault()
          this.setState({
            startDate:  moment().startOf('day').subtract(1, 'month'),
            endDate: moment().startOf('day'),
          })
        }} style={{paddingTop: '7px', display: 'inline-block', marginLeft: '1em'}}>最近一个月</a>
        <a href="#" onClick={e => {
          e.preventDefault()
          this.setState({
            startDate:  moment().startOf('day').subtract(2, 'month'),
            endDate: moment().startOf('day'),
          })
        }} style={{paddingTop: '7px', display: 'inline-block', marginLeft: '1em'}}>两个月</a>
      </div>
    </div>
    <div className="form-group">
      <div className="col-md-10">
        <Field
          component={FilterSelect}
          name="project"
          clearable={false}
          placeholder="选择要查询的仓库"
          options={[{
            value: store._id,
            label: store.company + store.name,
            pinyin: store.pinyin,
          }]}
          filterOption={filterOption}
        />
      </div>
      <div className="col-md-2">
        <Button color="primary" size="small" type="submit">查询</Button>
      </div>
    </div>
  </form>
)

const mapStateToProps = state => ({
  products: state.system.products,
  stocks: state.store.stocks,
  store: state.system.store,
})

export default reduxForm({
  form: 'StoreForm',
  initialValues: {
    startDate: moment().startOf('day'),
    endDate: moment().startOf('day')
  }
})(
  connect(mapStateToProps)(
    StoreForm
  )
)

