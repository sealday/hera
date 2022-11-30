import { Modal } from "antd"

export const confirm = ({ title, icon, content, okText = '确认', cancelText = '取消', onOk }) => {
  Modal.confirm({ title, icon, content, okText, cancelText, onOk })
}