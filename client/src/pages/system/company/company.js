import { Table } from 'antd'
import { PageHeader } from '../../../components'
import { useGetProductQuery } from '../../../api'
const Company = () => {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '纳税人类别',
      dataIndex: 'tc',
      key: 'tc',
    },
    {
      title: '纳税人识别号',
      dataIndex: 'tin',
      key: 'tin',
    },
    {
      title: '地址',
      dataIndex: 'addr',
      key: 'addr',
    },
    {
      title: '电话',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: '开户行',
      dataIndex: 'bank',
      key: 'bank',
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '行号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
  ]
  const mockData = [
    {
      name: '中建三局集团有限公司',
      tc: '一般纳税人',
      tin: '91420000757013137P',
      addr: '武汉市关山路552号',
      tel: '027-87132855',
      bank: '建行上海金杨支行',
      account: '31001577914050006493',
      role: '租赁客户',
    }
  ]
  const { data, error, isLoading } = useGetProductQuery()
  return <div>
    <PageHeader
      title='公司信息'
      subTitle='这里编辑所有的公司信息'
      onCreate={() => { }}
    />
    <Table columns={columns} dataSource={mockData} rowKey='name' />
  </div>
}

export default Company