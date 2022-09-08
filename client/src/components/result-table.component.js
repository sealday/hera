import { Card, Table } from "antd"
import _ from "lodash"

export default ({ columns, dataSource, summaryColumns, summaryDataSource, rowKey = 'key', pagination = false }) => {
  const summaryTable = () => !_.isEmpty(summaryDataSource) ? <Table
    columns={summaryColumns}
    dataSource={summaryDataSource}
    pagination={false}
  /> : null

  if (dataSource) {
    columns.forEach(column => {
      if (column.dataIndex
        // 没有自带的筛选项
        && !column.filters) {
        column.filterSearch = true
        column.onFilter = (value, record) => {
          if (value === '__未填写__') {
            return !record[column.dataIndex]
          }
          return record[column.dataIndex] === value
        } 
        column.filters = _.uniq(dataSource.map(record => record[column.dataIndex])).map(v => ({ text: v ? v : '未填写', value: v ? v : '__未填写__' }))
      }
    })
  }
  return (
    <Card bordered={false} size='small'>
      <Table
        columns={columns} dataSource={dataSource} size='small'
        rowKey={rowKey}
        footer={summaryTable}
        pagination={pagination}
      />
    </Card>
  )
}