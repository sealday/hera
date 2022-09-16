import _ from 'lodash'
import moment from 'moment'
import {
  Space,
  Table,
  Tag,
  Card,
  Tabs,
  Button,
  ConfigProvider,
} from 'antd'
import {
  useNavigate,
} from 'react-router-dom'

import { PLAN_CATEGORY_MAP, RULE_CATEGORIES } from '../../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { Error, LinkButton, Loading, PageHeader, PopconfirmButton, ResultTable } from '../../../components'
import heraApi from '../../../api'

export default () => {
  const navigate = useNavigate()
  const getRuleList = heraApi.useGetRuleListQuery()
  const [deleteRule] = heraApi.useDeleteRuleMutation()
  const [createRule] = heraApi.useCreateRuleMutation()
  const tabs = _.map(RULE_CATEGORIES, v => ({ key: v, label: v, children: null }))
  if (getRuleList.isError) {
    return <Error />
  }
  if (getRuleList.isLoading) {
    return <Loading />
  }
  // 设置 tab 内容
  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '日期', dataIndex: 'date', key: 'name', render: date => moment(date).format('YYYY-MM-DD') },
    { title: '备注', dataIndex: 'comments', key: 'comments' },
    { title: '操作', key: 'action', render: (_text, rule) => {
      return <Space>
        <LinkButton to={`/rule/${rule._id}`} >编辑</LinkButton>
        <Button type='link' onClick={() => createRule({...rule, name: rule.name + '（克隆）'}) }>克隆</Button>
        <PopconfirmButton title='确认删除？' onConfirm={() => deleteRule(rule._id)} danger>删除</PopconfirmButton>
      </Space>
    }}
  ]
  tabs.forEach(tab => {
    tab.children = (
      <ResultTable columns={columns} dataSource={getRuleList.data.filter(item => item.category === tab.label)} />
    )
  })
  return (
    <PageHeader
      title="计算方案"
      onCreate={() => navigate('/rule/create')}
    >
      <ConfigProvider componentSize='small'>
        <Card bordered={false}>
          <Tabs items={tabs} />
        </Card>
      </ConfigProvider>
    </PageHeader>
  )
}