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

export const DatePicker = ({ input }) => (
  <ReactDatePicker selected={input.value} className="form-control" onChange={date => input.onChange(date)} />
)

export const FilterSelect = ({ input, options, placeholder }) => {
  const {onChange, value} = input
  console.log(value)
  return <ReactSelect
    value={value}
    placeholder={placeholder}
    onChange={e => onChange(e.value)}
    clearable={false}
    options={options}
  />
}

export { default as Notification } from './Notification'

