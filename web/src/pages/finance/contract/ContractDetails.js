import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import { Popconfirm, Button, Card, Table, Space, Tag } from 'antd'
import { connect } from 'react-redux'
import { ALL_PLAN, queryAllPlans } from '../../../actions'
import { edit, addItem, addCalc } from './index'
import _, { pick } from 'lodash'
import { Error, Link, LinkButton, Loading, PageHeader } from 'components'
import heraApi from '../../../api'
import { useNavigate, useParams } from 'utils/hooks'
import { RULE_CATEGORIES } from 'constants'

const INITIAL_CATEGORY = '租金'

const PlanDeleteButton = ({ contractId, itemId }) => {
  const [deletePlan] = heraApi.useDeletePlanContractMutation()
  return <Popconfirm
    title={`确认取消关联该方案吗？`}
    onConfirm={() => {
      deletePlan({ id: contractId, itemId })
    }}
    okText="确认"
    cancelText="取消"
  >
    <a style={{ color: 'red' }}>取消关联</a>
  </Popconfirm>
}

const CalcDeleteButton = ({ contractId, calcId, dispatch }) => {
  const [deleteCalc] = heraApi.useDeleteCalcContractMutation()
  return <Popconfirm
    title={`确认删除该对账单？`}
    onConfirm={() => {
      deleteCalc({ id: contractId, calcId })
    } }
    okText="确认"
    cancelText="取消"
  >
    <a style={{ color: 'red' }}>删除</a>
  </Popconfirm>
}

const mapStateToProps = (state) => {
  const plans = state.results.get(ALL_PLAN, {})
  return {
    projects: state.system.projects,
    plans: plans,
  }
}

const ProjectLabel = ({ id }) => {
  const getProjectListAll = heraApi.useGetProjectListAllQuery()
  if (getProjectListAll.isError || getProjectListAll.isLoading) {
    return <Loading />
  }
  const project = _.find(getProjectListAll.data, item => item._id === id)
  return _.get(project, 'completeName')
}

const ContractDetails = connect(mapStateToProps)(({ projects, dispatch, plans }) => {
  const navigate = useNavigate()
  const getRuleList = heraApi.useGetRuleListQuery()
  const { id } = useParams()
  const getContract = heraApi.useGetContractQuery(id)
  const [updateContract] = heraApi.useUpdateContractMutation()
  const [addPlan] = heraApi.useAddPlanContractMutation()
  const [addContractCalc] = heraApi.useAddCalcContractMutation()
  const [restartCalc] = heraApi.useRestartCalcContractMutation()
  useEffect(() => {
    dispatch(queryAllPlans())
  }, [id])
  if (getContract.isError || getRuleList.isError) {
    return <Error />
  }
  if (getContract.isLoading || getRuleList.isLoading) {
    return <Loading />
  }
  const rules = getRuleList.data
  const contract = getContract.data
  const descriptions = [
    { label: "项目部", children: <ProjectLabel id={contract.project} /> },
    { label: "状态", children: <Tag color="green">{contract.status}</Tag> },
    { label: "签约时间", children: dayjs(contract.date).format('YYYY-MM-DD') },
    { label: "备注", children: contract.comments },
  ]
  return (
    <PageHeader
      title={contract.name}
      subTitle={contract.code}
      descriptions={descriptions}

      onEdit={() => {
        const initialValues = pick(contract, ['name', 'code', 'project', 'address', 'comments'])
        // TODO 统一日期处理在接口层，转换成 dayjs 对象
        if (contract.date) {
          initialValues.date = dayjs(contract.date)
        }
        edit({
          initialValues,
          onFinish: v => {
            updateContract({ id: contract._id, contract: v })
          },
          projects,
        })
      }}
    >
      <Card
        title="合同明细"
        extra={[
          <Button key={1} onClick={() => {
            addItem({
              initialValues: {
                category: INITIAL_CATEGORY,
                weight: null,
              },
              plans,
              rules,
              onFinish: v => {
                const requestBody = {
                  category: v.category,
                  weight: v.weight,
                  plan: v.plan,
                  start: v.date[0].startOf('day'),
                  end: v.date[1].startOf('day'),
                }
                addPlan({ id: contract._id, item: requestBody })
              },
            })
          }} type="primary">新增</Button>
        ]}
      >
        <Table dataSource={contract.items} rowKey='_id'>
          <Table.Column key="category" title="规则分类" dataIndex="category" render={text =>_.get(RULE_CATEGORIES.find(category => category.value === text), 'label')} />
          <Table.Column key="plan" title="计费规则" dataIndex="plan"
            render={plan => {
              const rule = _.find(rules, rule => rule._id === plan)
              if (rule && rule.name) {
                return <LinkButton to={`/rule/${rule._id}`}>{rule.name}</LinkButton> 
              } else {
                return '找不到对应计费规则'
              }
          } } />
          <Table.Column key='weight' title='计重规则' dataIndex='weight'
            render={plan => {
              const rule = _.find(rules, rule => rule._id === plan)
              if (rule && rule.name) {
                return <LinkButton to={`/rule/${rule._id}`}>{rule.name}</LinkButton> 
              } else {
                return '默认计重规则'
              }
            }}
          />
          <Table.Column key="start" title="开始日期" dataIndex="start"
            render={start => dayjs(start).format('YYYY-MM-DD')} />
          <Table.Column key="end" title="结束日期" dataIndex="end"
            render={end => dayjs(end).format('YYYY-MM-DD')} />
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
          <Button key={1} onClick={() => addCalc({
            initialValues: { name: dayjs().format('MM') + ' 月结算表' },
            onFinish: v => {
              const requestBody = {
                name: v.name,
                start: v.date[0].startOf('day'),
                end: v.date[1].startOf('day'),
              }
              addContractCalc({ id: contract._id, calc: requestBody })
            },
          })} type="primary">新增</Button>
        ]}
      >
        <Table dataSource={contract.calcs}>
          <Table.Column key="name" title="名称" dataIndex="name" />
          <Table.Column key="start" title="开始日期" dataIndex="start"
            render={start => dayjs(start).format('YYYY-MM-DD')} />
          <Table.Column key="end" title="结束日期" dataIndex="end"
            render={start => dayjs(start).format('YYYY-MM-DD')} />
          <Table.Column key="status" title="状态" dataIndex="status"
            render={t => t ? (t === 'latest' ? <Tag color='green'>最新</Tag> : <Tag color='red'>需要更新</Tag>) : <Tag color='gray'>未知</Tag>} />
          <Table.Column key="action" title="操作"
            render={(text, record) => (
              <Space size="middle">
                <Link to={`/contract/${contract._id}/calc/${record._id}`}>查看</Link>
                <a onClick={() => {
                  restartCalc({
                    id: contract._id,
                    calcId: record._id,
                    calc: _.omit(record, ['list', 'history', 'group', 'nameGroup']),
                  })
                }}>重新计算</a>
                <CalcDeleteButton contractId={contract._id} calcId={record._id} />
              </Space>
            )} />
        </Table>
      </Card>
    </PageHeader>
  )
})
export default ContractDetails