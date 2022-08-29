import React, { useState } from 'react'
import ReactMaskedInput from 'react-text-mask'
import fuzzysearch from 'fuzzysearch'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Button as AntButton,
  Input as AntInput,
  Select as AntSelect,
  DatePicker as AntDatePicker,
  PageHeader as AntPageHeader,
  Card,
  Form,
  Row,
  Col,
  Space,
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import * as moment  from 'moment'
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
  console.log(option)
  return fuzzysearch(input, option.children) || fuzzysearch(input, option.pinyin)
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


export { default as Notification } from './Notification'
export { default as CurrentStore } from './CurrentStore'
export { default as Profile } from './Profile'
export { default as MenuList } from './MenuList'
export { default as ReportFooter } from './ReportFooter'
export { default as DateRangeModifier } from './DateRangeModifier'
export { default as Flow } from './Flow'
export { default as DateModifier } from './DateModifier'
export { default as BackButton } from './button/BackButton'
export { default as LinkButton } from './button/LinkButton'
export { default as EnableTag } from './EnableTag'

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


export const PageHeader = ({ title, subTitle, onCreate }) => {
  const [filterValues, setFilterValues] = useState({})
  const [form] = Form.useForm()
  const recentItems = []
  return <>
    <AntPageHeader
      title={title}
      subTitle={subTitle}
      ghost={false}
      extra={onCreate ? <AntButton type='primary' onClick={onCreate} icon={<PlusCircleOutlined />}>创建</AntButton> : <></>}
    />
    <Card bordered={false}>
      <Form
        onFinish={values => setFilterValues(values)}
        onReset={() => setFilterValues({})}
        form={form}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="名称"
              name="name"
            >
              <AntInput autoComplete='off' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Space size="middle">
              <AntButton type='primary' htmlType='submit'>查询</AntButton>
              <AntButton htmlType='reset'>重置</AntButton>
            </Space>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Space>
              <span>最近搜索过：</span>
              {recentItems.map(item => (
                <AntButton type='dashed' key={item}
                  onClick={() => {
                    form.setFieldsValue({ name: item })
                    form.submit()
                  }}
                >{item}</AntButton>
              ))}
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  </>
}