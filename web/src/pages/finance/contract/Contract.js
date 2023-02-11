import React, { useEffect } from 'react'
import moment from 'moment'
import { pick } from 'lodash'
import { Button, Space, Tag, message, ConfigProvider } from 'antd'
import { useNavigate } from 'utils/hooks'
import { Error, Link, Loading, PageHeader, PopconfirmButton, ResultTable } from '../../../components'
import heraApi from '../../../api'
import ColorTag from 'components/tag/color.tag'

const ContractDeleteButton = ({ record }) => {
  const [deleteContract, deleteResult] = heraApi.useDeleteContractMutation()
  const title = `确认删除“${record.name}”合同吗？（删除后可通过管理员恢复）`
  return <PopconfirmButton
    title={title} danger onConfirm={() => deleteContract(record._id)}>删除</PopconfirmButton>
}

const ContractFinishButton = ({ record }) => {
  const [finishContract, finishResult] = heraApi.useFinishContractMutation()
  const title = `确认完结“${record.name}”合同吗？`
  return <PopconfirmButton
    title={title} onConfirm={() => finishContract(record._id)}>完结</PopconfirmButton>
}

const ContractUnfinishButton = ({ record }) => {
  const [unfinishContract, unfinishResult] = heraApi.useUnfinishContractMutation()
  const title = `确认开始“${record.name}”合同吗？`
  return <PopconfirmButton
    title={title} onConfirm={() => unfinishContract(record._id)}>开始</PopconfirmButton>
}

export default () => {
  const navigate = useNavigate()
  const getContractList = heraApi.useGetContractListQuery()
  const [createContract, createResult] = heraApi.useCreateContractMutation()
  useEffect(() => {
    if (createResult.isError) {
      message.error('创建（或克隆）失败')
    }
  }, [createResult.isError])
  if (getContractList.isError) {
    return <Error />
  }
  if (getContractList.isLoading) {
    return <Loading />
  }
  const contracts = getContractList.data
  const onClone = record => {
    const v = pick(record, [
      'name', 'code', 'project', 'address', 'date', 'comments',
    ])
    v.name += '（克隆）'
    createContract(v)
  }
  const columns = [
    { title: "名称", key: "name", dataIndex: "name" },
    { title: "关联标签", key: "tags", dataIndex: "tags",render(tags) {
    
        return (
          tags.length > 0 ?  <ColorTag tags={ tags } />:null
         
        )
        
      }
    },
    { title: "编号", key: "code", dataIndex: "code" },
    { title: "日期", key: "date", dataIndex: "date", render(date) { return moment(date).format('YYYY-MM-DD') } },
    { title: "地址", key: "address", dataIndex: "address" },
    { title: "备注", key: "comments", dataIndex: "comments" },
    {
      title: "状态", key: "status", dataIndex: "status", render(tag) {
        const color = tag === '进行' ? 'green' : 'red';
        return <Tag color={color}>{tag}</Tag>
      }
    },
    {
      title: '操作', key: 'action', render(_, record) {
        return (
          <Space>
            <Link to={`/contract/${record._id}`}>查看</Link>
            <Button type='link' onClick={() => onClone(record)}>克隆</Button>
            {record.status === '完结' ? <ContractUnfinishButton record={record} /> : <ContractFinishButton record={record} />}
            <ContractDeleteButton record={record} />
          </Space>
        )
      }
    },
  ]
  return (
    <PageHeader
      title="合同管理"
      onCreate={() => navigate('/contract/create')}
    >
      <ConfigProvider componentSize='small'>
        <ResultTable dataSource={contracts} columns={columns} rowKey="_id" pagination={{}} />
      </ConfigProvider>
    </PageHeader>
  )
}