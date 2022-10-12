import { Button, Popconfirm } from "antd"

export default ({ title, onConfirm, children, danger }) => {

  return (
    <Popconfirm title={title} onConfirm={onConfirm} cancelText='取消' okText='确认'>
      <Button type='link' danger={danger}>{children}</Button>
    </Popconfirm>
  )
}