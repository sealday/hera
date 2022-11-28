import { createElement } from 'react'
import { Alert, ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { createRoot } from 'react-dom/client'
import { store, history, BASENAME } from '../globalConfigs'
import { Provider } from 'react-redux'
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

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
        root.render(
          <Provider store={store}>
            <HelmetProvider context={{}}>
              <ConfigProvider locale={zh_CN}>
                <Alert.ErrorBoundary>
                  <HistoryRouter history={history} basename={BASENAME}>
                    {createElement(component, { ...props, open, onClose })}
                  </HistoryRouter>
                </Alert.ErrorBoundary>
              </ConfigProvider>
            </HelmetProvider>
          </Provider>
        )
      })
    }
    render()
  }
}

export default createModal