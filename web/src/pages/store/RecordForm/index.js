import React, { useContext, useState } from 'react'
import { Form } from 'antd'
import _ from 'lodash'

import { SettingContext } from '../records'
import BaseInfoCard from './components/baseInfo.card'
import DetailInfoCard from './components/detailInfo.card'
import ExtraInfoCard from './components/extraInfo.card'

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
  return (
    <Form
      onFinish={onSubmit}
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
      <DetailInfoCard title="过磅明细信息" />
      <ExtraInfoCard title="赔偿维修信息" />
      <ExtraInfoCard title="额外信息" />
    </Form>
  )
}
