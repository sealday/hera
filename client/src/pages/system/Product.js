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

import { ajax, wrapper } from '../../utils'
import { newErrorNotify, newInfoNotify } from '../../actions'
import { PageHeader, ResultTable } from '../../components'
import ProductForm from './ProductForm'
import { Space, Table, Button } from 'antd'

const ProductCreateForm = reduxForm({ form: 'PRODUCT_CREATE' })(ProductForm)
const ProductEditForm = reduxForm({ form: 'PRODUCT_EDIT' })(ProductForm)

const FormDialog = withStyles(theme => ({
  paper: {
    width: '1024px',
  }
}))(Dialog)

const Product = ({ dispatch, productFilter }) => {
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [current, setCurrent] = useState(null)

  let createForm = null
  let editForm = null

  useEffect(() => {
    dispatch(newInfoNotify('提示', '正在加载产品列表', 1000))
    ajax('/api/product').then((res) => {
      setProducts(res.data.products)
    }).catch((err) => {
      dispatch(newErrorNotify('警告', '加载产品列表出错', 1000))
    })
  }, [])
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
    ajax('/api/product', {
      data: JSON.stringify(product),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      setProducts(products => products.concat(product))
      setCreateOpen(true)
    }).catch((err) => {
      dispatch(newErrorNotify('警告', '创建出错', 1000))
    })
  }
  const onEdit = (product) => {
    ajax(`/api/product/${product.number}`, {
      data: JSON.stringify(product),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      setProducts((products) => {
        return products.map((old) => old.number === product.number ? product : old)
      })
      setOpen(false)
    }).catch((err) => {
      dispatch(newErrorNotify('警告', '编辑出错', 1000))
    })
  }
  const onDelete = () => {
    ajax(`/api/product/${current.number}/delete`, {
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      setProducts(products => products.filter((old) => old.number !== current.number))
      setDeleteConfirm(false)
    }).catch((err) => {
      dispatch(newErrorNotify('警告', '删除出错', 1000))
    })
  }
  const columns = [
    { title: '编号', dataIndex: 'number', key: 'number', },
    { title: '类别', dataIndex: 'type', key: 'type' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '规格', dataIndex: 'size', key: 'size' },
    {
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
    },
  ]
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

export default wrapper([
  connect(state => ({ productFilter: getFormValues('PRODUCT_FILTER')(state) })),
  Product,
])
