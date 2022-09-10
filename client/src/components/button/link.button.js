import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

export default ({ children, to }) => {
    const navigate = useNavigate()
    return <Button type='link' onClick={() => navigate(to)}>{children}</Button>
}