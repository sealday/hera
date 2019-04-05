import React from 'react'
import ReactDatePicker from 'react-datepicker'
import ReactSelect from 'react-select'
import ReactMaskedInput from 'react-text-mask'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { toFixedWithoutTrailingZero as fixed } from '../utils'

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

export const MaskedInput = ({ input, meta: { touched, error, warning }, style, ...custom }) => {
  if (touched && error) {
    style = {
      ...style,
      ...errorStyle,
    }
  }
  return (
    <ReactMaskedInput {...input} className="form-control" {...custom}
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

export const FilterSelect = ({ input, options, style, meta: { touched, error, warning }, ...custom }) => {
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

export const ReportFooter = ({ report, noWeight }) => (
  <List>
    {report.map((report, index) => (
      <ListItem divider={true} dense={true} key={index}>
        {noWeight ?
          <ListItemText primary={`${report.name} ${report.total} ${report.unit}`}/>
          :
          <ListItemText primary={`
        ${report.name} ${report.total} ${report.unit}
        ${report.weight === 0 ? ' *' : ' ' + fixed(report.weight / 1000, 3)} 吨
        `}/>
        }
      </ListItem>
    ))}
  </List>
)

export { default as Notification } from './Notification'
export { default as CurrentStore } from './CurrentStore'
export { default as Profile } from './Profile'
export { default as MenuList } from './MenuList'
