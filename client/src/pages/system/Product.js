import React from 'react'

import { genTableColumn } from '../../utils'
import { Error, Loading, ModalFormButton, PageHeader, PopconfirmButton, ResultTable } from '../../components'
import { Space, ConfigProvider } from 'antd'
import heraApi from '../../api'
import { productSchema } from '../../schema'
import { PlusCircleOutlined } from '@ant-design/icons'

export default () => {
  const getProductList = heraApi.useGetProductListQuery()
  const [createProduct] = heraApi.useCreateProductMutation()
  const [deleteProduct] = heraApi.useDeleteProductMutation()
  const [updateProduct] = heraApi.useUpdateProductMutation()
  const products = getProductList.data

  const onCreate = (product) => {
    createProduct(product)
  }
  const onEdit = (id, product) => {
    updateProduct({ id, product })
  }
  const onDelete = (id) => {
    deleteProduct(id)
  }
  if (getProductList.isError) {
    return <Error />
  }
  if (getProductList.isLoading) {
    return <Loading />
  }
  const columns = genTableColumn(productSchema)
  console.log(columns)
  columns.push({
    title: '动作', key: 'action',
    render: (_, product) => {
      return <Space>
        <ModalFormButton
          onSubmit={v => onEdit(product._id, v)}
          title='编辑产品' type='link' schema={productSchema} initialValues={product}>编辑</ModalFormButton>
        <PopconfirmButton title='确认删除？' danger onConfirm={() => onDelete(product._id)}>删除</PopconfirmButton>
      </Space>
    },
  })
  return (
    <PageHeader
      title='产品信息'
      subTitle='在这里可以编辑产品信息'
      onCreate={{
        title: '新增产品',
        schema: productSchema,
        onSubmit: onCreate,
      }}
    >
      <ConfigProvider componentSize='small'>
        <ResultTable
          pagination={{ pageSize: 60 }}
          columns={columns}
          rowKey='number'
          dataSource={products}
        />
      </ConfigProvider>
    </PageHeader>
  )
}