import React from 'react'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  DatePicker,
  FilterSelect,
  DateRangeModifier,
  Select,
} from '../components'
import {
  filterOption,
  wrapper,
  RECORD_TYPES,
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
      <label className="control-label col-md-1">类型</label>
      <div className="col-md-2">
        <Field
          component={Select}
          name="type"
          clearable={false}
        >
          {['全部', ...RECORD_TYPES].map((name, i) => (
            <option key={i} value={name === '全部' ? '' : name}>{name}</option>
          ))}
        </Field>
      </div>
      <label className="control-label col-md-1">仓库</label>
      <div className="col-md-8">
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
  }),
  connect(mapStateToProps),
  StoreForm,
])
