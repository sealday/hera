import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
    const navigate = useNavigate()
    return <Button onClick={() => navigate(-1)}>返回</Button>
}

export default BackButton