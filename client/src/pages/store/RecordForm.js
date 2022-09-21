import { AutoComplete, Card, Checkbox, Col, DatePicker, Form, Input, Row, Select, Switch } from "antd"
import _ from "lodash"
import moment from "moment"
import { RefSelect } from "../../components"
import { RECORD_CLIENT_TYPES } from "../../utils"
import React, { useContext } from 'react';
import EntryForm from "./records/entry.form"
import ComplementForm from "./records/complement.form"
import { SettingContext } from "./records"
import { CAR_NUMBERS } from "../../constants"

const styles = {
  block: { width: '100%' },
  keepSpace: { marginTop: '8px' },
}
const rules = [{ required: true }]

export default ({ form, initialValues, onSubmit }) => {
  const settings = useContext(SettingContext)
  const type = Form.useWatch('type', form)
  const projectItem = {
    label: '仓库', name: 'projectId', type: 'text', required: true,
    option: {
      type: 'ref', ref: 'project', label: 'name', value: '_id',
    },
    filter: {
      key: 'type', value: type,
    },
  }
  return (
    <Form onFinish={onSubmit} form={form} colon={false} labelCol={{ flex: '5em' }} labelWrap initialValues={initialValues}>
      <Card bordered={false} title='基础信息'>
        <Row gutter={24}>
          {settings.project ? <Col span={8}>
            <Form.Item label="类别" name='type' rules={rules}>
              <Select>
                {RECORD_CLIENT_TYPES.map(name => <Select.Option key={name}>{name}</Select.Option>)}
              </Select>
            </Form.Item>
          </Col> : null}
          {settings.project ? <Col span={8}>
            <RefSelect item={projectItem} />
          </Col> : null}
          <Col span={8}>
            <Form.Item label="日期" name='outDate' rules={rules}>
              <DatePicker style={styles.block} />
            </Form.Item>
          </Col>
          {settings.originalOrder ? <Col span={8}>
            <Form.Item label="原始单号" name='originalOrder'>
              <Input />
            </Form.Item>
          </Col> : null}
          {settings.carNumber ? <Col span={8}>
            <Form.Item label="车号" name='carNumber'>
              <AutoComplete options={CAR_NUMBERS.map(item => ({ label: item, value: item }))} />
            </Form.Item>
          </Col> : null}
          {settings.weight ? <Col span={8}>
            <Form.Item label="重量" name='weight'>
              <Input suffix='吨' />
            </Form.Item>
          </Col> : null}
          {settings.freight ? <Col span={8}>
            <Form.Item label="合同运费" name='freight' valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col> : null}
          <Col span={24}>
            <Form.Item label="备注" name='comments'>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card bordered={false} title='明细信息' style={styles.keepSpace}>
        <Row>
          <Col span={24}>
            <Form.List name="entries">
              {(fields, operation, meta) => <EntryForm fields={fields} operation={operation} meta={meta} />}
            </Form.List>
          </Col>
        </Row>
      </Card>
      <Card bordered={false} title='补充信息' style={styles.keepSpace}>
        <Row>
          <Col span={24}>
            <Form.List name="complements" >
              {(fields, operation, meta) => <ComplementForm fields={fields} operation={operation} meta={meta} />}
            </Form.List>
          </Col>
        </Row>
      </Card>
    </Form>
  )
}