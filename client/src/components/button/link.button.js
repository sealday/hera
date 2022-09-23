import { useNavigate } from 'utils/hooks'
import { Button } from 'antd'

export default ({ children, to, ...otherProps }) => {
    const navigate = useNavigate()
    return <Button type='link' {...otherProps} onClick={() => navigate(to)}>{children}</Button>
}