import { Button } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { removeAllItem } from '../../features/coreSlice'

export default () => {
  const dispatch = useDispatch()
  return (
    <Button
      key="closeAll"
      type="text"
      onClick={() => {
        dispatch(removeAllItem())
      }}
      icon={<CloseCircleOutlined />}
    ></Button>
  )
}
