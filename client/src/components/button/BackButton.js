import { Button } from 'antd'
import { useDispatch } from 'react-redux'
import { goBack } from 'react-router-redux'

const BackButton = () => {
    const dispatch = useDispatch()
    return <Button onClick={() => dispatch(goBack())}>返回</Button>
}

export default BackButton