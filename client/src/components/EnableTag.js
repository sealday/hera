import React from 'react'
import { Tag } from 'antd'

const EnableTag = ({state}) => (state === 'disabled' ? <Tag color='red'>禁用</Tag> : <Tag color='blue'>在用</Tag>)
export default EnableTag