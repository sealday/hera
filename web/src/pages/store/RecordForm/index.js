import React, { useContext, useState } from 'react'
import { Form } from 'antd'
import _ from 'lodash'

import { SettingContext } from '../records'
import BaseInfoCard from './components/baseInfo.card'
import DetailInfoCard from './components/detailInfo.card'
import ExtraInfoCard from './components/extraInfo.card'
import { convertValues } from './utils/convert.js'

export default ({ form, initialValues, onSubmit }) => {
  const settings = useContext(SettingContext)
  const type = Form.useWatch('type', form)
  const projectItem = {
    label: '仓库',
    name: 'projectId',
    type: 'text',
    required: true,
    option: {
      type: 'ref',
      ref: 'project',
      label: 'name',
      value: '_id',
    },
    filter: {
      key: 'type',
      value: type,
    },
  }

  const onFinish = values => {
    // 此处做了个数据转换处理，为了适应原来的老数据结构，等之后对整体系统数据熟悉后，可以重构这里的数据传递方式
    const cookedValues = convertValues(values)
    onSubmit(cookedValues)
  }

  return (
    <Form
      onFinish={onFinish}
      form={form}
      colon={false}
      labelCol={{ flex: '5em' }}
      labelWrap
      initialValues={initialValues}
    >
      <BaseInfoCard
        title="基础信息"
        settings={settings}
        projectItem={projectItem}
      />
      <DetailInfoCard title="明细信息" />
      <ExtraInfoCard title="赔偿维修信息" />
      <ExtraInfoCard title="额外信息" />
    </Form>
  )
}
