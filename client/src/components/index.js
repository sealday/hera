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

export const Input = ({ input, meta: { touched, error, warning }, style, ...custom }) => {
  if (touched && error) {
      style = {
      ...style,
      ...errorStyle,
    }
  }
  return (
  <input {...input} className="form-control" {...custom}
    style={style}
  />
)}

export const TextArea = ({ input, meta: { touched, error, warning }, style, ...custom }) => {
  if (touched && error) {
    style = {
      ...style,
      ...errorStyle,
    }
  }
  return (
    <textarea {...input} className="form-control" {...custom}
           style={style}
    />
  )}

export const Select = ({ input, children }) => (
  <select {...input} className="form-control" >{children}</select>
)

export const DatePicker = ({ input, ...custom }) => (
  <ReactDatePicker selected={input.value} className="form-control" onChange={date => input.onChange(date)} autoComplete="off" {...custom} />
)

export const FilterSelect = ({ input, options, style, ...custom, meta: { touched, error, warning } }) => {
  const {onChange, value, onFocus } = input
  const { placeholder, filterOption, disabled } = custom

  if (touched && error) {
    style = {
      ...style,
      ...errorStyle,
    }
  }

  return <ReactSelect
    style={style}
    onFocus={onFocus}
    value={value}
    disabled={disabled}
    placeholder={placeholder}
    onChange={e => onChange(e.value)}
    clearable={false}
    options={options}
    filterOption={filterOption}
  />
}

export { default as Notification } from './Notification'
export { default as CurrentStore } from './CurrentStore'
export { default as Drawer } from './Drawer'
export { default as Profile } from './Profile'
export { default as MenuList } from './MenuList'
