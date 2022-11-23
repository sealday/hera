import React from 'react'
import { ConfigProvider } from 'antd'
import ContractEditModal from './ContractEditModal'
import ContractAddItemModal from './ContractAddItemModal'
import ContractAddCalcModal from './ContractAddCalcModal'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import Contract from './Contract'
import { createRoot } from 'react-dom/client'

const createModal = component => {
  return props => {
    let open = true
    const div = document.createElement('div')
    const root = createRoot(div)
    document.body.appendChild(div)
    // after close
    function onClose() {
      open = false
      render()
      root.unmount()
      if (div.parentNode) {
        div.parentNode.removeChild(div)
      }
    }
    // per render
    function render() {
      setTimeout(() => {
        root.render(<ConfigProvider locale={zh_CN}>
          {React.createElement(component, { ...props, open, onClose })}
        </ConfigProvider >)
      })
    }
    render()
  }
}
export const edit = createModal(ContractEditModal) 
export const addItem = createModal(ContractAddItemModal)
export const addCalc = createModal(ContractAddCalcModal)
export default Contract