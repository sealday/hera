import React from 'react'
import { Card, Form } from 'antd'

import { genFormContent } from '../../utils/antd'
import settingSchema from '../../schema/setting.schema'

const SettingsForm = ({ form, onSubmit, initialValues }) => {
  const formContent = genFormContent(settingSchema)
  return (
    <Card>
      <Form labelCol={{ flex: '160px' }} form={form} onFinish={onSubmit} initialValues={initialValues}>
        {formContent}
      </Form>
    </Card>
  )
}

export default SettingsForm