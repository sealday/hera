import React from 'react'

import { Card, Form } from 'antd'
import { genFormContent } from '../../utils/antd'
import projectSchema from '../../schema/project.schema'

const ProjectForm = ({ form, initialValues, onSubmit }) => {
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