import React from 'react'
import ReactMaskedInput from 'react-text-mask'
import fuzzysearch from 'fuzzysearch'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Input as AntInput,
  Select as AntSelect,
  DatePicker as AntDatePicker,
} from 'antd'
import moment from 'moment'
import { isUndefined } from 'lodash'

import RawEditableTagGroup from './EditableTagGroup.js'

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
  const { onBlur, ...otherInput } = input
  return (
    <AntSelect
      style={style}
      {...custom}
      {...otherInput}
      onBlur={v => {
        onBlur(otherInput.value)
      }}
    >
      {custom.children.map(child =>
      <AntSelect.Option
        key={!isUndefined(child.props.value) ? child.props.value : child.props.children}
        value={!isUndefined(child.props.value) ? child.props.value : child.props.children}>
          {child.props.children}
      </AntSelect.Option>)}
    </AntSelect>
  )
}

export const DatePicker = ({ input: { value, onChange }, style, meta: { touched, error }, ...custom }) => {
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
      value={value ? moment(value) : null}
      onChange={date => onChange(date)}
      allowClear={false}
      disabledDate={current => {
        if (custom.selectsStart) {
          return current.valueOf() > moment(custom.endDate).valueOf()
        } else if (custom.selectsEnd) {
          return current.valueOf() < moment(custom.startDate).valueOf()
        } else {
          return false
        }
      }}
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

export const defaultFilterOption = (filter, option) => {
  return fuzzysearch(filter, option.props.label)
}

export const antFilterOption = (input, option) => {
  return fuzzysearch(input, option.children) || fuzzysearch(input, option.pinyin)
}

export const smartFilterOption = (input, option) => {
  return fuzzysearch(input, option.label) || (option.pinyin && fuzzysearch(input, option.pinyin))
}

export const FilterSelect = ({ input, options, style, meta: { touched, error, warning }, ...custom }) => {
  const { filterOption } = custom

  if (touched && error) {
    style = {
      width: '100%',
      ...style,
      ...errorStyle,
      // Ant 选择框外部样式
      borderWidth: '1px',
      borderRadius: '4px',
      borderStyle: 'solid',
    }
  } else {
    style = {
      width: '100%',
      ...style,
    }
  }

  const { onBlur, ...otherInput } = input

  return <AntSelect
    {...otherInput}
    {...custom}
    showSearch
    filterOption={filterOption ? filterOption : defaultFilterOption}
    onBlur={v => onBlur(otherInput.value)}
    style={style}>
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

export const EditableTagGroup = ({ input: { value, onChange }, style, meta: { touched, error }, ...custom }) => {
  return <RawEditableTagGroup tags={value} onChange={onChange}>
  </RawEditableTagGroup>
}


export { default as CurrentStore } from './CurrentStore'
export { default as MenuList } from './menu-list.component'
export { default as DateRangeModifier } from './DateRangeModifier'
export { default as DateModifier } from './DateModifier'
export { default as BackButton } from './button/BackButton'
export { default as EnableTag } from './EnableTag'
export { default as Error } from './error.component'
export { default as PageHeader } from './page-header.component'
export { default as Loading } from './loading.component'
export { default as PrintFrame } from './print-frame.component'
export { default as ExpandableTable } from './expandable-table.component'
export { default as TreeTable } from './tree-table.component'
export { default as ResultTable } from './result-table.component'
export { default as TabTreeTable } from './tab-tree-table.component'
export { default as PopoverFormButton } from './popover-form-button.component'
export { default as PopconfirmButton } from './button/popconfirm.button'
export { default as LinkButton } from './button/link.button'
export { default as ModalFormButton } from './button/modal-form.button'
export { default as ModalPrintPreviewButton } from './button/modal-print-preview.button'
export { default as RefSelect } from './ref-select.component'
export { default as RefCascader } from './ref-cascader.component'
export { default as RefLabel } from './ref-label.component'
export { default as RefCascaderLabel } from './ref-cascader-label.component'
export { default as DepLabel } from './dep-label.component'
export { default as DateRangeFooter } from './date-range-footer.component'

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate()
    const params = useParams()
    
    return (
      <Component
        navigate={navigate}
        params={params}
        {...props}
        />
    )
  }
  
  return Wrapper
}

export const IfShow = ({ cond, children, ifNot }) => cond ? <>{children}</> : <>{ifNot}</>