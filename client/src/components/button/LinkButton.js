import { Link } from 'react-router'
import { Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const LinkButton = () => {
    return <Link to="/plan/create"><Button type="primary">
        <SaveOutlined />保存</Button>
    </Link>
}

export default LinkButton
