import { message, Upload as AntUpload } from 'antd'
import React, { useState } from 'react'
import { getAuthToken } from 'utils'

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'

  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }

  const isLt2M = file.size / 1024 / 1024 < 20

  if (!isLt2M) {
    message.error('Image must smaller than 10MB!')
  }

  return isJpgOrPng && isLt2M
}

const Upload = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState()

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }

    if (info.file.status === 'done') {
      setImageUrl(
        `/api/upload/${info.file.response.filename}?token=${getAuthToken()}`
      )
    }
  }

  const token = getAuthToken()
  return (
    <AntUpload
      name="file"
      listType="text"
      className="avatar-uploader"
      showUploadList={false}
      headers={{ Authorization: `Bearer ${token}` }}
      action="/api/upload"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {children}
    </AntUpload>
  )
}

export default Upload
