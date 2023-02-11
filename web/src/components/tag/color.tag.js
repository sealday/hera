import { Tag } from 'antd'
import { randomNumber } from '../../utils/math'
const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple'
]
export default ({ tags }) => {
  return (
    <>
      {(tags || []).map(tag => (
        <Tag key={tag} color={colors[randomNumber(0, colors.length)]}>
          {tag}
        </Tag>
      ))}
    </>
  )
}
