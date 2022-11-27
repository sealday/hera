import { createElement } from 'react'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
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
      // 等待动画结束
      setTimeout(() => {
        root.unmount()
        if (div.parentNode) {
          div.parentNode.removeChild(div)
        }
      }, 500)
    }
    // per render
    function render() {
      setTimeout(() => {
        root.render(<ConfigProvider locale={zh_CN}>
          {createElement(component, { ...props, open, onClose })}
        </ConfigProvider >)
      })
    }
    render()
  }
}

export default createModal