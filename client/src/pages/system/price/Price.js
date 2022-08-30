import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { PlusCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
  Space,
  Table,
  PageHeader
} from 'antd'
import {
  Popconfirm,
} from 'antd'
import { ajax, enableFilters } from '../../../utils'
import { newErrorNotify, newInfoNotify, newSuccessNotify, queryPricePlan, PRICE_PLAN } from '../../../actions'
import _ from 'lodash'
import { EnableTag } from '../../../components'

const Price = ({ dispatch, plans }) => {
  const [filterValues, setFilterValues] = useState({})
  const [form] = Form.useForm()
  const handleDelete = (id) => {
    dispatch(newInfoNotify('提示', '正在删除', 1000))
    ajax(`/api/plan/price/${id}/delete`, {
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      dispatch(newSuccessNotify('提示', '删除成功', 1000))
      dispatch(queryPricePlan())
    }).catch((err) => {
      dispatch(newErrorNotify('警告', '删除失败', 1000))
    })
  }
  // mock data
  _.forEach(plans, plan => {
    if (_.random(10) >= 5) {
      plan.state = 'enable'
    } else {
      plan.state = 'disabled'
    }
  })
  if (filterValues.name) {
    plans = _.filter(plans, plan => _.includes(plan.name, filterValues.name))
  }
  const recentItems = ['中建三局', '中建八局', '上海']
  useEffect(() => {
    dispatch(queryPricePlan())
  }, [])
  const columns = [
    {
      "title": "名称",
      "dataIndex": "name",
      "key": "name",
      "filterSearch": true,
      "width": "320px",
      "ellipsis": true,
    },
    {
      "title": "日期",
      "dataIndex": "date",
      "key": "date",
      "render": date => moment(date).format('YYYY-MM-DD'),
      "sorter": (a, b) => moment(a.date) - moment(b.date),
      "width": "150px",
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: state => <EnableTag state={state} />,
      width: '80px',
      defaultFilteredValue: ['enable'],
      filters: enableFilters,
      onFilter: (value, record) => record.state.indexOf(value) === 0,
    },
    {
      "title": "备注",
      "dataIndex": "comments",
      "key": "comments",
    },
    {
      "title": "操作",
      "key": "action",
      "render": (_, plan) => {
        return <Space size="middle">
          <Link component="button" to={`/price/${plan._id}`}>编辑</Link>
          <Popconfirm
            title={`确认删除“${plan.name}”方案吗？`}
            onConfirm={() => handleDelete(plan._id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type='text' danger>删除</Button>
          </Popconfirm>
          <Link to={`/price/create/${plan._id}`}>克隆</Link>
        </Space>
      }
    },
  ]
  return (
    <div>
      <PageHeader
        ghost={false}
        title="租金方案"
        subTitle="在这里可以设定租金方案，通过在合同中关联实现租金计算"
        extra={[
          <Link to="/price/create"><Button icon={<PlusCircleOutlined />} type='primary' key="1">创建</Button></Link>
        ]}
      />
      <Card bordered={false}>
        <Form
          onFinish={values => setFilterValues(values)}
          onReset={() => setFilterValues({})}
          form={form}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="名称"
                name="name"
              >
                <Input autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Space size="middle">
                <Button type='primary' htmlType='submit'>查询</Button>
                <Button htmlType='reset'>重置</Button>
              </Space>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Space>
                <span>最近搜索过：</span>
                {recentItems.map(item => (
                  <Button type='dashed' key={item}
                    onClick={() => {
                      form.setFieldsValue({ name: item })
                      form.submit()
                    }}
                  >{item}</Button>
                ))}
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      <Table dataSource={plans} columns={columns}></Table>
    </div>
  )
}
const mapStateToProps = (state) => {
  const plans = state.results.get(PRICE_PLAN, [])
  return {
    plans: plans,
  }
}
export default connect(mapStateToProps)(Price)
