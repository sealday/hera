import React, { useEffect } from 'react'
import moment from 'moment'
import { Popconfirm, Button, Card, Table, Space, Tag } from 'antd'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { ALL_PLAN, CONTRACT_DETAILS, newErrorNotify, newSuccessNotify, queryContractDetails, queryAllPlans } from '../../../actions'
import { ajax } from '../../../utils'
import { edit, addItem, addCalc } from './index'
import { PLAN_CATEGORY_MAP } from '../../../constants'
import _, { pick } from 'lodash'
import { Error, Loading, PageHeader } from '../../../components'
import heraApi from '../../../api'

const INITIAL_CATEGORY = '租金'

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
  const plans = state.results.get(ALL_PLAN, {})
  return {
    projects: state.system.projects,
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

const ContractDetails = connect(mapStateToProps)(({ projects, dispatch, plans }) => {
  const getRuleList = heraApi.useGetRuleListQuery()
  const { id } = useParams()
  const getContract = heraApi.useGetContractQuery(id)
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
    { label: "项目部", children: <ProjectLabel projectId={contract.project} /> },
    { label: "状态", children: <Tag color="green">{contract.status}</Tag> },
    { label: "签约时间", children: moment(contract.date).format('YYYY-MM-DD') },
    { label: "备注", children: contract.comments },
  ]
  return (
    <PageHeader
      title={contract.name}
      subTitle={contract.code}
      descriptions={descriptions}

      onEdit={() => {
        const initialValues = pick(contract, ['name', 'code', 'project', 'address', 'comments'])
        // TODO 统一日期处理在接口层，转换成 moment 对象
        if (contract.date) {
          initialValues.date = moment(contract.date)
        }
        edit({
          initialValues,
          onFinish: v => {
            ajax(`/api/contract/${contract._id}`, {
              data: JSON.stringify(v),
              method: 'POST',
              contentType: 'application/json'
            }).then(() => {
              dispatch(newSuccessNotify('提示', '更新成功', 1000))
              dispatch(queryContractDetails(id))
            }).catch(() => {
              dispatch(newErrorNotify('警告', '更新失败', 1000))
            })
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
              },
              plans,
              rules,
              onFinish: v => {
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
                  dispatch(queryContractDetails(id))
                }).catch(() => {
                  dispatch(newErrorNotify('警告', '添加失败', 1000))
                })
              },
            })
          }} type="primary">新增</Button>
        ]}
      >
        <Table dataSource={contract.items}>
          <Table.Column key="category" title="分类" dataIndex="category" />
          <Table.Column key="plan" title="名称" dataIndex="plan"
            render={plan => rules.filter(rule => rule._id === plan)[0].name } />
          <Table.Column key="start" title="开始日期" dataIndex="start"
            render={start => moment(start).format('YYYY-MM-DD')} />
          <Table.Column key="end" title="结束日期" dataIndex="end"
            render={end => moment(end).format('YYYY-MM-DD')} />
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
            initialValues: { name: moment().format('MM') + ' 月结算表' },
            onFinish: v => {
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
                dispatch(queryContractDetails(id))
              }).catch(() => {
                dispatch(newErrorNotify('警告', '添加失败', 1000))
              })
            },
          })} type="primary">新增</Button>
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
                <a onClick={() => {
                  ajax(`/api/contract/${contract._id}/calc/${record._id}/restart`, {
                    data: JSON.stringify(_.omit(record, ['list', 'history', 'group', 'nameGroup'])),
                    method: 'POST',
                    contentType: 'application/json'
                  }).then(() => {
                    dispatch(queryContractDetails(id))
                  }).catch(() => {
                    dispatch(newErrorNotify('警告', '重新计算失败', 1000))
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