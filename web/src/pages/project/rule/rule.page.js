import _ from 'lodash'
import moment from 'moment'
import {
  Space,
  Card,
  Tabs,
  Button,
  ConfigProvider,
} from 'antd'
import { useNavigate } from 'utils/hooks'

import { RULE_CATEGORIES } from '../../../constants'
import { Error, LinkButton, Loading, PageHeader, PopconfirmButton, ResultTable } from '../../../components'
import heraApi from '../../../api'

export default () => {
  const navigate = useNavigate()
  const getRuleList = heraApi.useGetRuleListQuery()
  const [deleteRule] = heraApi.useDeleteRuleMutation()
  const [createRule] = heraApi.useCreateRuleMutation()
  const tabs = _.map(RULE_CATEGORIES, ({ label, value }) => ({ key: value, value, label, children: null }))
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
        <LinkButton to={`/rule/${rule._id}/clone`} >克隆</LinkButton>
        <PopconfirmButton title='确认删除？' onConfirm={() => deleteRule(rule._id)} danger>删除</PopconfirmButton>
      </Space>
    }}
  ]
  tabs.forEach(tab => {
    tab.children = (
      <ResultTable rowKey='_id' columns={columns} dataSource={getRuleList.data.filter(item => item.category === tab.value)} />
    )
  })
  const items = [
    { key: 'rent', label: '租金规则', onClick: () => navigate('/rule/create/租金') },
    { key: 'weight', label: '计重规则', onClick: () => navigate('/rule/create/计重') },
    { key: 'perOrder', label: '装卸运费', onClick: () => navigate('/rule/create/装卸运费') },
    { key: 'other', label: '其它费用', onClick: () => navigate('/rule/create/非租') },
  ]
  return (
    <PageHeader
      title="合同规则管理"
      onCreateMenu={items}
    >
      <ConfigProvider componentSize='small'>
        <Card bordered={false}>
          <Tabs items={tabs} />
        </Card>
      </ConfigProvider>
    </PageHeader>
  )
}