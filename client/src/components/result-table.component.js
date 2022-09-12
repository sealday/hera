import { Card, Table } from "antd"
import _ from "lodash"

export default ({ rowSelection, columns, dataSource, summaryColumns, summaryDataSource, rowKey = 'key', pagination = false }) => {
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
            return !_.toString(record[column.dataIndex])
          }
          return record[column.dataIndex] === value
        } 
        if (column.render) {
          column.filters = _.uniq(dataSource.map(record => [record[column.dataIndex], record])).map(([v, record]) => ({ text: _.toString(v) ? column.render(v, record) : '未填写', value: _.toString(v) ? v : '__未填写__' }))
        } else {
          column.filters = _.uniq(dataSource.map(record => record[column.dataIndex])).map(v => ({ text: _.toString(v) ? v : '未填写', value: _.toString(v) ? v : '__未填写__' }))
        }
      }
      if (column.dataIndex
        // 没有自带排序行数
        && !column.sorter
        && dataSource && dataSource.length > 0
        ) {
          if (_.isNumber(dataSource[0][column.dataIndex])) {
            column.sorter = (a, b) => a[column.dataIndex] - b[column.dataIndex]
          } else {
            column.sorter = (a, b) => a[column.dataIndex] > b[column.dataIndex]
              ? 1
              : a[column.dataIndex] === b[column.dataIndex] ? 0 : -1
          }
        }
    })
  }
  return (
    <Card bordered={false} size='small'>
      <Table
        rowSelection={rowSelection}
        columns={columns} dataSource={dataSource} size='small'
        rowKey={rowKey}
        footer={summaryTable}
        pagination={pagination}
      />
    </Card>
  )
}