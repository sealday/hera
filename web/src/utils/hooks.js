import { ArrowLeftOutlined, CloseOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { addItem, removeItem, updateTitle } from "features/coreSlice"
import { TabContext } from "globalConfigs"
import _ from "lodash"
import { useEffect } from "react"
import { useCallback } from "react"
import { useContext } from "react"
import { useDispatch } from "react-redux"
import { useNavigate as useRouteNavigate, useParams as useRouteParams, useSearchParams } from "react-router-dom"
import QRCode from 'qrcode'
import { useState } from "react"

export const useParams = () => {
  const routeParams = useRouteParams()
  const [searchParams] = useSearchParams()
  const tabContext = useContext(TabContext)
  if (tabContext.has) {
    return tabContext.params
  } else {
    const params = _.merge({}, routeParams)
    // searchParams 更高优先级
    for (const [key, value] of searchParams) {
      params[key] = value
    }
    return params
  }
}

const canGoBack = () => {
  // FIXME 这个方式几乎总是为 true，没有任何限制
  return window.history.length > 1
}

export const useTab = ({ title }) => {
  const tabContext = useContext(TabContext)
  const dispatch = useDispatch()
  const navigate = useRouteNavigate()
  // 更新标题
  useEffect(() => {
    if (tabContext.has && tabContext.key) {
      dispatch(updateTitle({
        key: tabContext.key,
        title: title,
      }))
    }
  }, [tabContext.key, title])
  // 关闭或者返回键
  if (tabContext.has) {
    return <Button key='close' type='default' onClick={() => dispatch(removeItem(tabContext.key))} icon={<CloseOutlined />}>关闭</Button>
  } else if (canGoBack()) {
    return <Button key='goBack' type='default' onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>返回</Button>
  } else {
    return null
  }
}

export const useNavigate = () => {
  const navigate = useRouteNavigate()
  const tabContext = useContext(TabContext)
  const dispatch = useDispatch()
  const tabNavigate = useCallback((to) => {
    if (to === -1) {
      // 返回映射到关闭 tab
      dispatch(removeItem(tabContext.key))
    } else {
      dispatch(addItem({
        key: to,
        label: '加载中...',
      }))
    }
  }, [])
  if (tabContext.has) {
    return tabNavigate
  } 
  return navigate
}

export const useQrCode = (value) => {
  const [result, setResult] = useState(null)
  useEffect(() => {
    QRCode.toDataURL(value).then(url => {
      setResult(url)
    })
  }, [value])

  if (result) {
    return {
      isLoading: false,
      data: result,
    }
  } else {
    return {
      isLoading: true,
      data: null,
    }
  }
}