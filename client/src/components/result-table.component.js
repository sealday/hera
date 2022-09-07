import { Card, Table } from "antd"

export default ({ columns, dataSource, summaryColumns, summaryDataSource}) => {
  const summaryTable = () => <Table
    columns={summaryColumns}
    dataSource={summaryDataSource}
    pagination={false}
  />
  return (
    <Card bordered={false} title='查询结果' size='small'>
      <Table
        columns={columns} dataSource={dataSource} size='small'
        footer={summaryTable}
        pagination={false}
      />
    </Card>
  )
}