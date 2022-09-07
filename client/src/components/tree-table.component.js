import { Card, Table } from "antd"

export default ({ columns, dataSource }) => {
  return (
    <Card bordered={false} title='查询结果' size='small'>
      <Table
        size='small'
        expandable={{ expandRowByClick: true }}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </Card>
  )
}