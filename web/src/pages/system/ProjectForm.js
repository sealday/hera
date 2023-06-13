import React from 'react'

import { Card, Form } from 'antd'
import { genFormContent } from '../../utils/antd'
import projectSchema from '../../schema/project.schema'
import { useSelector } from 'react-redux'

const ProjectForm = ({ form, initialValues, onSubmit }) => {
  const config = useSelector(state => state.system.config)
  projectSchema.forEach(item => {
    if (item.name === 'associatedCompany') {
      item.option = {
        type: 'static_value_only',
        values: config.externalNames,
      }
    }
  })
  const formContent = genFormContent(projectSchema, 2)

  return (
    <Card>
      <Form labelCol={{ flex: '100px' }} form={form} initialValues={initialValues} onFinish={onSubmit}>
        {formContent}
      </Form>
    </Card>
  )
}

export default ProjectForm