import { Table } from "antd"

export default ({ columns, dataSource }) => {
  return <Table
    expandable={{ expandRowByClick: true }}
    columns={columns}
    dataSource={dataSource}
    pagination={false}
  />
}