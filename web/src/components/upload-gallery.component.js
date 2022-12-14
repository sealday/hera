import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Modal, Upload } from 'antd'
import { getAuthToken } from 'utils'

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
const UploadGallery = ({ onAdd, onRemove, files }) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState(
    files.map(file => ({
      uid: file.filename,
      name: file.filename,
      fileName: file.filename,
      url: `/api/upload/${file.filename}?token=${getAuthToken()}`,
    }))
  )
  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
  }
  const token = getAuthToken()
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传
      </div>
    </div>
  )
  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        headers={{ Authorization: `Bearer ${token}` }}
        action="/api/upload"
        onPreview={handlePreview}
        onRemove={onRemove}
        onChange={({ file, fileList }) => {
          if (file.status === 'done') {
            file.uid = file.response.filename
            file.name = file.response.filename
            file.fileName = file.response.filename
            onAdd(file)
          }
          setFileList(fileList)
        }}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  )
}
export default UploadGallery
