import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload as AntUpload } from 'antd';
import React, { useState } from 'react';
import { getAuthToken } from 'utils';

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }

  const isLt2M = file.size / 1024 / 1024 < 20;

  if (!isLt2M) {
    message.error('Image must smaller than 10MB!');
  }

  return isJpgOrPng && isLt2M;
};

const Upload = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();


  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setImageUrl(`/api/upload/${info.file.response.filename}?token=${getAuthToken()}`)
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const token = getAuthToken()
  return (
    <AntUpload
      name="file"
      listType="picture-card"
      style={{ width: '300px' }}
      className="avatar-uploader"
      showUploadList={false}
      headers={{ Authorization: `Bearer ${token}` }}
      action="/api/upload"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="avatar"
          style={{
            width: '100%',
          }}
        />
      ) : (
        uploadButton
      )}
    </AntUpload>
  );
};

export default Upload;