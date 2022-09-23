import { Button } from "antd"
import { TabContext } from "globalConfigs"
import { useContext } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { addItem } from "../features/coreSlice"

export default ({ to, children }) => {
  const dispatch = useDispatch()
  const tabContext = useContext(TabContext)
  if (tabContext.has) {
    return <Button type='link' onClick={() => {
      dispatch(addItem({
        key: to,
        label: '加载中...',
      }))
    }}>{children}</Button>
  }
  return <Link to={to}>{children}</Link>
}