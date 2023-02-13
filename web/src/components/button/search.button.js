import { useNavigate } from 'utils/hooks'
import { Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const SearchButton = ({
  children,
  to,
  type = 'primary',
  onClick,
  ...otherProps
}) => {
  return (
    <Button
      key="onSearch"
      type="primary"
      onClick={onClick}
      icon={<SearchOutlined />}
      {...otherProps}
    >
      查询
    </Button>
  )
}

export default SearchButton
