import { Card, Table } from "antd"
import _ from "lodash"

export default ({ columns, dataSource, summaryColumns, summaryDataSource}) => {
  const summaryTable = () => !_.isEmpty(summaryDataSource) ? <Table
    columns={summaryColumns}
    dataSource={summaryDataSource}
    pagination={false}
  /> : null
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