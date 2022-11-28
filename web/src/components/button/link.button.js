import { useNavigate } from 'utils/hooks'
import { Button } from 'antd'

const LinkButton = ({ children, to, type = 'link', ...otherProps }) => {
    const navigate = useNavigate()
    return <Button type={type} {...otherProps} onClick={() => navigate(to)}>{children}</Button>
}

export default LinkButton