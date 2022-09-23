import { Button } from "antd"
import { uniqueId } from "lodash"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { addItem } from "../features/coreSlice"

export default ({ to, children }) => {


  const dispatch = useDispatch()
  if (true) {
    const recordId = to.split('/')[2]
    return <Button type='link' onClick={() => {
      const key = uniqueId()
      dispatch(addItem({
        key: key,
        label: '加载中...',
        name: 'contract',
        params: {
          id: recordId,
        }
      }))
    }}>新Link{children}</Button>
  }
  return <Link to={to}>{children}</Link>
}