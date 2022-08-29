import React, { Component } from 'react'
import { reduxForm, Field, FieldArray } from 'redux-form'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Button,
  Card,
  Col,
  Form,
  PageHeader,
  Row,
  Select,
  Input,
  DatePicker,
} from 'antd'
import {
  PlusCircleOutlined
} from '@ant-design/icons'
import { Link } from 'react-router'

import EntryTable from './TransferEntryTable'
import {
  filterOption,
  validator,
  getProjects,
} from '../utils'

const styles = () => ({
  header: {
    padding: 16,
  },
  panel: {
    flexDirection: 'column'
  },
  submitButton: {
    width: '100%',
    marginTop: 16,
  }
})

const TransferForm = ({title}) => {
  return <div>
    <PageHeader
      ghost={false}
      title={title}
      extra={[
        <Link to="/price/create"><Button icon={<PlusCircleOutlined />} type='primary' key="1">创建</Button></Link>
      ]}
    />
    <Form>
      <Card>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name='project'
              label='项目部'
            >
              <Select
                showSearch
              ></Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='outDate'
              label='日期'
            >
              <DatePicker 
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='originalOrder'
              label='原始单号'
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  </div>
}

const mapStateToProps = state => ({
  projects: state.system.projects,
  stocks: state.store.stocks,
})

export default connect(mapStateToProps)(TransferForm)
