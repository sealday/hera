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
  DateRangeModifier,
} from '../components'
import {
  filterOption,
  wrapper,
} from '../utils'

const StoreForm = ({ store, handleSubmit, change }) => (
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
        <DateRangeModifier
          change={change}
          key_start="startDate"
          key_end="endDate"
        />
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

export default wrapper([
  connect(mapStateToProps),
  reduxForm({
    form: 'StoreForm',
    initialValues: { startDate: moment().startOf('day'),
      endDate: moment().startOf('day')
    }
  }),
  StoreForm,
])
