import React, { useEffect, useState } from 'react'
import { reduxForm, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import {
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import {
  withStyles,
} from '@material-ui/core/styles'

import { ajax, genTableColumn, wrapper } from '../../utils'
import { newErrorNotify, newInfoNotify } from '../../actions'
import { Error, Loading, PageHeader, ResultTable } from '../../components'
import ProductForm from './ProductForm'
import { Space, Table, Button, ConfigProvider } from 'antd'
import heraApi from '../../api'
import { productSchema } from '../../schema'

const ProductCreateForm = reduxForm({ form: 'PRODUCT_CREATE' })(ProductForm)
const ProductEditForm = reduxForm({ form: 'PRODUCT_EDIT' })(ProductForm)

const FormDialog = withStyles(theme => ({
  paper: {
    width: '1024px',
  }
}))(Dialog)

export default () => {
  const getProductList = heraApi.useGetProductListQuery()
  const [createProduct, createResult] = heraApi.useCreateProductMutation()
  const [deleteProduct, deleteResult] = heraApi.useDeleteProductMutation()
  const [updateProduct, updateResult] = heraApi.useUpdateProductMutation()
  const products = getProductList.data
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [current, setCurrent] = useState(null)

  let createForm = null
  let editForm = null

  const handleClose = () => {
    setOpen(false)
    setCreateOpen(false)
  }
  const handleDeleteConfirmOpen = (product) => {
    setDeleteConfirm(true)
    setCurrent(product)
  }
  const handleDeleteConfirmClose = () => {
    setDeleteConfirm(false)
  }
  const onCreate = (product) => {
    createProduct(product)
  }
  const onEdit = (product) => {
    updateProduct({ id: current._id, product })
  }
  const onDelete = () => {
    deleteProduct(current._id)
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
        <Button type='link' onClick={() => {
          setCurrent(product)
          setOpen(true)
        }} >编辑</Button>
        <Button type='text' danger onClick={() => { handleDeleteConfirmOpen(product) }} >删除</Button>
      </Space>
    },
  })
  return (
    <PageHeader
      title='产品信息'
      subTitle='在这里可以编辑产品信息'
      onCreate={() => { setCreateOpen(true) }}
    >
      <ResultTable
        pagination={{ pageSize: 60 }}
        columns={columns}
        rowKey='number'
        dataSource={products}
      />
      <CardContent>
        <FormDialog open={open}>
          <DialogTitle>编辑</DialogTitle>
          <DialogContent>
            <ProductEditForm
              initialValues={current}
              onSubmit={(d) => onEdit(d)}
              ref={f => editForm = f}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button color="primary" onClick={() => editForm.submit()}>保存</Button>
          </DialogActions>
        </FormDialog>
        <FormDialog open={createOpen}>
          <DialogTitle>新增</DialogTitle>
          <DialogContent>
            <ProductCreateForm
              onSubmit={(d) => onCreate(d)}
              ref={f => createForm = f}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button color="primary" onClick={() => createForm.submit()}>保存</Button>
          </DialogActions>
        </FormDialog>
        <Dialog open={deleteConfirm}>
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            删除后可能造成不必要的麻烦，如果需要恢复，请新增一个编号相同的产品！
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose}>取消</Button>
            <Button color="secondary" onClick={onDelete}>确定删除</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </PageHeader>
  )
}