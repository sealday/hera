import React from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import ContractEditModal from './ContractEditModal'
import ContractAddItemModal from './ContractAddItemModal'
import ContractAddCalcModal from './ContractAddCalcModal'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import Contract from './Contract'

const createModal = component => {
  return props => {
    let visible = true
    const div = document.createElement('div')
    document.body.appendChild(div)
    // after close
    function onClose() {
      visible = false
      render()
      if (ReactDOM.unmountComponentAtNode(div) && div.parentNode) {
        div.parentNode.removeChild(div)
      }
    }
    // per render
    function render() {
      setTimeout(() => {
        ReactDOM.render(<ConfigProvider locale={zh_CN}>
          {React.createElement(component, { ...props, visible, onClose })}
        </ConfigProvider >, div)
      })
    }
    render()
  }
}
export const edit = createModal(ContractEditModal) 
export const addItem = createModal(ContractAddItemModal)
export const addCalc = createModal(ContractAddCalcModal)
export default Contract