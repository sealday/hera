/**
 * Created by seal on 25/01/2017.
 */
import React from 'react'
import ReactDatePicker from 'react-datepicker'
import ReactSelect from 'react-select'

export const Input = ({ input }) => (
  <input {...input} className="form-control" />
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

