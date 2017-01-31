/**
 * Created by seal on 25/01/2017.
 */
import React from 'react'
import ReactDatePicker from 'react-datepicker'
import ReactSelect from 'react-select'

const errorStyle = {
  borderColor: '#a94442',
  boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, .075)'
}

export const Input = ({ input, meta: { touched, error, warning }, ...custom }) => (
  <input {...input} className="form-control" {...custom}
    style={touched && error ? errorStyle : null}
  />
)

export const Select = ({ input, children }) => (
  <select {...input} className="form-control" >{children}</select>
)

export const DatePicker = ({ input, ...custom }) => (
  <ReactDatePicker selected={input.value} className="form-control" onChange={date => input.onChange(date)} {...custom} />
)

export const FilterSelect = ({ input, options, ...custom }) => {
  const {onChange, value, onFocus } = input
  const { placeholder, filterOption } = custom
  return <ReactSelect
    onFocus={onFocus}
    value={value}
    placeholder={placeholder}
    onChange={e => onChange(e.value)}
    clearable={false}
    options={options}
    filterOption={filterOption}
  />
}

export { default as Notification } from './Notification'

