import React, { useRef, useState } from 'react'
import { Card, Col, Form, Row, Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import DetailInfoForm from './form/detailInfo.form'
import { styles } from '../utils/constants'

const ExtraButton = props => {
  const { onClick } = props
  return (
    <Button type="primary" onClick={onClick} icon={<PlusCircleOutlined />}>
      增加分组
    </Button>
  )
}

const DetailInfoCard = props => {
  const { title } = props
  const formListRef = useRef(null)

  const addRowFunc = () => {
    formListRef.current && formListRef.current()
  }

  return (
    <Card
      bordered={false}
      title={title}
      style={styles.keepSpace}
      extra={<ExtraButton onClick={addRowFunc} />}
    >
      <Row>
        <Col span={24}>
          <Form.List name="detailInfos">
            {(fields, operation, meta) => {
              formListRef.current = operation.add
              return (
                <DetailInfoForm
                  fields={fields}
                  operation={operation}
                  meta={meta}
                />
              )
            }}
          </Form.List>
        </Col>
      </Row>
    </Card>
  )
}
export default DetailInfoCard
