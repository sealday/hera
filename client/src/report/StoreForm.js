import React from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  DatePicker,
  FilterSelect,
  DateRangeModifier,
} from '../components'
import {
  filterOption,
  wrapper,
} from '../utils'

const StoreForm = ({ store, handleSubmit, change, startDate, endDate }) => (
  <form className="form-horizontal" onSubmit={handleSubmit}>
    <div className="form-group">
      <label className="control-label col-md-1">开始日期</label>
      <div className="col-md-2">
        <Field
          component={DatePicker}
          name="startDate"
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <label className="control-label col-md-1">结束日期</label>
      <div className="col-md-2">
        <Field
          component={DatePicker}
          name="endDate"
          selectsEnd
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <div className="col-md-6">
        <DateRangeModifier
          change={change}
          key_start="startDate"
          key_end="endDate"
          current={startDate}
        />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-md-1">仓库</label>
      <div className="col-md-11">
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
    </div>
  </form>
)


const selector = formValueSelector('StoreForm')

const mapStateToProps = state => ({
  products: state.system.products,
  stocks: state.store.stocks,
  store: state.system.store,
  startDate: selector(state, 'startDate'),
  endDate: selector(state, 'endDate'),
})

export default wrapper([
  reduxForm({
    form: 'StoreForm',
    initialValues: {
      startDate: moment().startOf('day'),
      endDate: moment().startOf('day')
    }
  }),
  connect(mapStateToProps),
  StoreForm,
])
