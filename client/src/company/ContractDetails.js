import React, { useEffect, useState } from 'react'

import moment from 'moment'
import { Popconfirm, Button, Card, PageHeader, Table, Space, Tag, Row, Col, Descriptions, Modal, Form, Input, Select, DatePicker } from 'antd'
import { Link } from 'react-router'
import 'antd/lib/card/style/css'
import 'antd/lib/page-header/style/css'
import 'antd/lib/table/style/css'
import 'antd/lib/space/style/css'
import 'antd/lib/tag/style/css'
import 'antd/lib/row/style/css'
import 'antd/lib/col/style/css'
import 'antd/lib/descriptions/style/css'
import 'antd/lib/modal/style/css'
import { connect } from 'react-redux'
import { ALL_PLAN, CONTRACT_DETAILS, newErrorNotify, newInfoNotify, newSuccessNotify, queryContractDetails, queryAllPlans } from '../actions'
import { ajax } from '../utils'

const NAME_MAP = {
  loss: '赔偿方案',
  weight: '计重方案',
  price: '租金方案',
  service: '维修方案',
}

const INITIAL_CATEGORY = 'price'

const PlanDeleteButton = connect()(({ contractId, itemId, dispatch }) => <Popconfirm
  title={`确认取消关联该方案吗？`}
  onConfirm={() => {
    ajax(`/api/contract/${contractId}/item/${itemId}/delete`, {
      method: 'POST',
      contentType: 'application/json'
    }).then(() => {
      dispatch(queryContractDetails(contractId))
    }).catch(() => {
      dispatch(newErrorNotify('警告', '删除失败', 1000))
    })
  }}
  okText="确认"
  cancelText="取消"
>
  <a style={{ color: 'red' }}>取消关联</a>
</Popconfirm>)

const CalcDeleteButton = connect()(({ contractId, calcId, dispatch }) => <Popconfirm
  title={`确认删除该对账单？`}
  onConfirm={() => {
    ajax(`/api/contract/${contractId}/calc/${calcId}/delete`, {
      method: 'POST',
      contentType: 'application/json'
    }).then(() => {
      dispatch(queryContractDetails(contractId))
    }).catch(() => {
      dispatch(newErrorNotify('警告', '删除失败', 1000))
    })
  }}
  okText="确认"
  cancelText="取消"
>
  <a style={{ color: 'red' }}>删除</a>
</Popconfirm>)

const mapStateToProps = (state) => {
  const contract = state.results.get(CONTRACT_DETAILS, {})
  const plans = state.results.get(ALL_PLAN, {})
  return {
    contract: contract,
    plans: plans,
  }
}

const PlanLabel = connect(mapStateToProps)(({ plans, planId }) => {
  const planMap = {}
  for (let k in plans) {
    for (let plan of plans[k]) {
      planMap[plan._id] = plan
    }
  }
  if (planId in planMap) {
    return <>{planMap[planId].name}</>
  }
  return <></>
})

const ProjectLabel = connect(state => ({
  projects: state.system.projects,
}))(({ projects, projectId }) => {
  if (projects && projects.get(projectId)) {
    return <>{projects.get(projectId).completeName}</>
  }
  return <>projectId</>
})

export default connect(mapStateToProps)(({ router, dispatch, plans, contract, params: { id } }) => {
  const [form] = Form.useForm()
  const [calcForm] = Form.useForm()
  const [currentPlans, setCurrentPlans] = useState([])

  useEffect(() => {
    dispatch(queryAllPlans())
    dispatch(queryContractDetails(id))
  }, [id])

  useEffect(() => {
    if (plans[form.getFieldValue('category')]) {
      setCurrentPlans(plans[form.getFieldValue('category')])
    } else if (plans[INITIAL_CATEGORY]) {
      setCurrentPlans(plans[INITIAL_CATEGORY])
    }
  }, [plans])

  const [isPlanAddedShow, setPlanAddedShow] = useState(false)
  const [isCalcAddedShow, setCalcAddedShow] = useState(false)

  return <Space direction="vertical">
    <PageHeader
      ghost={false}
      title={contract.name}
      subTitle={contract.code}
      extra={[
        <Button key={1} onClick={() => router.goBack()}>返回</Button>,
        <Link key={2} to="/contract/edit"><Button type="primary">编辑</Button></Link>,
      ]}
    >
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="项目部"><ProjectLabel projectId={contract.project} /></Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color="green">{contract.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="签约时间">{moment(contract.date).format('YYYY-MM-DD')}</Descriptions.Item>
        <Descriptions.Item label="备注">
          {contract.comments}
        </Descriptions.Item>
      </Descriptions>
    </PageHeader>
    <Card
      title="合同明细"
      extra={[
        <Button key={1} onClick={() => {
          setPlanAddedShow(true)
        }} type="primary">新增</Button>
      ]}
    >
      <Table dataSource={contract.items}>
        <Table.Column key="category" title="分类" dataIndex="category"
          render={category => NAME_MAP[category]} />
        <Table.Column key="plan" title="名称" dataIndex="plan"
          render={plan => <PlanLabel planId={plan} />} />
        <Table.Column key="start" title="开始日期" dataIndex="start"
          render={start => moment(start).format('YYYY-MM-DD')} />
        <Table.Column key="end" title="结束日期" dataIndex="end"
          render={start => moment(start).format('YYYY-MM-DD')} />
        <Table.Column key="action" title="操作"
          render={(text, record) => (
            <Space size="middle">
              <PlanDeleteButton contractId={contract._id} itemId={record._id} />
            </Space>
          )} />
      </Table>
    </Card>
    <Card
      title="结算单"
      extra={[
        <Button key={1} onClick={() => setCalcAddedShow(true)} type="primary">新增</Button>
      ]}
    >
      <Table dataSource={contract.calcs}>
        <Table.Column key="name" title="名称" dataIndex="name" />
        <Table.Column key="start" title="开始日期" dataIndex="start"
          render={start => moment(start).format('YYYY-MM-DD')} />
        <Table.Column key="end" title="结束日期" dataIndex="end"
          render={start => moment(start).format('YYYY-MM-DD')} />
        <Table.Column key="action" title="操作"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/contract/${contract._id}/calc/${record._id}`}>查看</Link>
              <a>重新计算</a>
              <CalcDeleteButton contractId={contract._id} calcId={record._id} />
            </Space>
          )} />
      </Table>
    </Card>
    <Modal
      title="合同明细"
      visible={isPlanAddedShow}
      onOk={() => form.submit()}
      onCancel={() => setPlanAddedShow(false)}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        name="合同基础信息"
        form={form}
        initialValues={{
          category: INITIAL_CATEGORY,
        }}
        onValuesChange={e => {
          if (e['category']) {
            setCurrentPlans(plans[e['category']])
            form.resetFields(['plan'])
          }
        }}
        onFinish={v => {
          const requestBody = {
            category: v.category,
            plan: v.plan,
            start: v.date[0].startOf('day'),
            end: v.date[1].startOf('day'),
          }
          ajax(`/api/contract/${contract._id}/add_item`, {
            data: JSON.stringify(requestBody),
            method: 'POST',
            contentType: 'application/json'
          }).then(() => {
            setPlanAddedShow(false)
            dispatch(queryContractDetails(id))
          }).catch(() => {
            dispatch(newErrorNotify('警告', '添加失败', 1000))
          })
        }}
      >
        <Form.Item
          label="方案分类"
          name="category"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <Select>
            <Select.Option key={1} value="price">租金方案</Select.Option>
            <Select.Option key={2} value="weight">计重方案</Select.Option>
            <Select.Option key={3} value="loss">赔偿方案</Select.Option>
            <Select.Option key={4} value="service">维修方案</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="方案"
          name="plan"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <Select>
            {currentPlans.map(plan => <Select.Option key={plan._id} value={plan.value}>
              {plan.name}
            </Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          label="时间区间"
          name="date"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <DatePicker.RangePicker />
        </Form.Item>
      </Form>
    </Modal>
    <Modal
      title="结算单"
      visible={isCalcAddedShow}
      onOk={() => calcForm.submit()}
      onCancel={() => setCalcAddedShow(false)}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        name="结算单"
        form={calcForm}
        initialValues={{
          name: moment().format('MM') + ' 月结算表',
        }}
        onFinish={v => {
          const requestBody = {
            name: v.name,
            start: v.date[0].startOf('day'),
            end: v.date[1].startOf('day'),
          }
          ajax(`/api/contract/${contract._id}/add_calc`, {
            data: JSON.stringify(requestBody),
            method: 'POST',
            contentType: 'application/json'
          }).then(() => {
            setCalcAddedShow(false)
            dispatch(queryContractDetails(id))
          }).catch(() => {
            dispatch(newErrorNotify('警告', '添加失败', 1000))
          })
        }}
      >
        <Form.Item
          label="结算名称"
          name="name"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="时间区间"
          name="date"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <DatePicker.RangePicker />
        </Form.Item>
      </Form>
    </Modal>
  </Space>
})