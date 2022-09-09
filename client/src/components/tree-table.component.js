import { Card, Table } from "antd"

export default ({ columns, dataSource, rowKey = 'key' }) => {
  return (
    <Card bordered={false} size='small'>
      <Table
        size='small'
        rowKey={rowKey}
        expandable={{ expandRowByClick: true }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </Card>
  )
}