import { Card, Table, Tabs } from "antd"

export default ({ footers, expandRowByClick = true, columns: rawColumns, dataSource, rowKey = 'key', tabDef }) => {
  const columns = rawColumns.filter(column => column.dataIndex !== tabDef.dataIndex)
  const items = tabDef.values.map(v => ({
    key: v,
    label: v,
    children: (
      <>
        <Table
          size='small'
          rowKey={rowKey}
          expandable={{ expandRowByClick }}
          columns={columns}
          dataSource={dataSource.filter(record => record[tabDef.dataIndex] === v)}
          pagination={false}
        />
        {footers(v)}
      </>
    )
  }))
  return (
    <Card bordered={false} size='small'>
      <Tabs items={items} />
    </Card>
  )
}