import _ from 'lodash'
import moment from 'moment'
import { SaveOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, PageHeader, Row, Select, DatePicker, Cascader, Space, Descriptions } from 'antd'
import { IconFont } from '../../components'
import { STORE_CATEGORIES } from '../../constants'
import { buildProjectTree } from '../../utils'
import { useSelector } from 'react-redux'
import OrderItem from './OrderItem'
import { useState } from 'react'

const OrderDetails = () => {
  const [form] = Form.useForm()
  const projects = useSelector(state => state.system.projects)
  const projectRoot = buildProjectTree(projects)
  return <>
    <PageHeader
      title={`出售单`}
      subTitle="210406"
      ghost={false}
      extra={[
        <Button key={4}  onClick={() => form.submit()}>返回</Button>,
        <Button key={3}  onClick={() => form.submit()}>运输单</Button>,
        <Button key={2}  onClick={() => form.submit()}>打印预览</Button>,
        <Button key={1} type="primary" onClick={() => form.submit()}>编辑</Button>,
      ]} >
        <Descriptions column={1}>
          <Descriptions.Item label="时间">2021-05-05</Descriptions.Item>
          <Descriptions.Item label="出库">上海创兴建筑设备租赁有限公司松江基地仓库</Descriptions.Item>
          <Descriptions.Item label="入库">中建三局集团有限公司嘉善云帆大厦项目</Descriptions.Item>
        </Descriptions>
    </PageHeader>
    <div style={{ height: '8px' }}></div>
    <Card tabList={[{ 'key': '租赁', 'tab': '租赁' }, { 'key': '出售', 'tab': '出售'}]} title="明细" bordered={false}>
    </Card>
  </>
}

export default OrderDetails