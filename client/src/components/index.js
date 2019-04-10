import React from 'react'
import ReactMaskedInput from 'react-text-mask'
import fuzzysearch from 'fuzzysearch'

import {
  Input as AntInput,
  Select as AntSelect,
  DatePicker as AntDatePicker,
} from 'antd'
import * as moment  from 'moment'
import 'antd/lib/input/style/css'
import 'antd/lib/select/style/css'
import 'antd/lib/date-picker/style/css'


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
  <AntInput {...input} {...custom}
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
    <ReactMaskedInput
      {...input}
      {...custom}
      style={style}
      className="ant-input"
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
    <AntInput.TextArea {...input} {...custom}
           style={style}
    />
  )}

export const Select = ({ input, style, meta: { touched, error }, ...custom }) => {
  if (touched && error) {
    style = {
      width: '100%',
      ...style,
      ...errorStyle,
    }
  } else {
    style = {
      width: '100%',
      ...style,
    }
  }
  return (
    <AntSelect style={style} {...input} {...custom}>{custom.children.map(child =>
      <AntSelect.Option
        key={child.props.value ? child.props.value : child.props.children}
        value={child.props.value ? child.props.value : child.props.children}>
          {child.props.children}
      </AntSelect.Option>)}
    </AntSelect>
  )
}

export const DatePicker = ({ input, style, meta: { touched, error }, ...custom }) => {
  if (touched && error) {
    style = {
      width: '100%',
      ...style,
      ...errorStyle,
    }
  } else {
    style = {
      width: '100%',
      ...style,
    }
  }

  return (
    <AntDatePicker
      style={style}
      {...input}
      value={moment(input.value)}
      onChange={date => input.onChange(date)}
      {...custom} />
  )
}

export const RangePicker = ({ input, style, meta: { touched, error }, ...custom }) => {
  if (touched && error) {
    style = {
      width: '100%',
      ...style,
      ...errorStyle,
    }
  } else {
    style = {
      width: '100%',
      ...style,
    }
  }

  return (
    <AntDatePicker.RangePicker
      style={style}
      {...input}
      value={moment(input.value)}
      onChange={date => input.onChange(date)}
      {...custom} />
  )
}

const defaultFilterOption = (filter, option) => {
  return fuzzysearch(filter, option.props.label)
}

export const FilterSelect = ({ input, options, style, meta: { touched, error, warning }, ...custom }) => {
  const {onChange, value, onFocus } = input
  const { placeholder, filterOption, disabled } = custom

  if (touched && error) {
    style = {
      width: '100%',
      ...style,
      ...errorStyle,
    }
  } else {
    style = {
      width: '100%',
      ...style,
    }
  }

  // return <ReactSelect
  //   style={style}
  //   onFocus={onFocus}
  //   value={value}
  //   disabled={disabled}
  //   placeholder={placeholder}
  //   onChange={e => onChange(e.value)}
  //   clearable={false}
  //   options={options}
  //   filterOption={filterOption}
  // />
  return <AntSelect
    showSearch
    filterOption={filterOption ? filterOption : defaultFilterOption}
    style={style} {...input}>
    {options.map(option => <AntSelect.Option
      pinyin={option.pinyin}
      label={option.label}
      key={option.value}
      value={option.value}
    >
      {option.label}
    </AntSelect.Option>)}
  </AntSelect>
}


export { default as Notification } from './Notification'
export { default as CurrentStore } from './CurrentStore'
export { default as Profile } from './Profile'
export { default as MenuList } from './MenuList'
export { default as ReportFooter } from './ReportFooter'
