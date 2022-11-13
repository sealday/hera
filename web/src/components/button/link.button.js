import { useNavigate } from 'utils/hooks'
import { Button } from 'antd'

const LinkButton = ({ children, to, ...otherProps }) => {
    const navigate = useNavigate()
    return <Button type='link' {...otherProps} onClick={() => navigate(to)}>{children}</Button>
}

export default LinkButton