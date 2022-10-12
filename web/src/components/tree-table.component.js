import { Card, Table } from "antd"

export default ({ actions, expandRowByClick = true, columns, dataSource, rowKey = 'key' }) => {
  return (
    <Card bordered={false} extra={actions}>
      <Table
        rowKey={rowKey}
        expandable={{ expandRowByClick }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </Card>
  )
}