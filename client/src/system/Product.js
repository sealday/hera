import React from 'react'
import { Field, reduxForm, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'

import { ajax } from '../utils'
import { newErrorNotify, newInfoNotify } from '../actions'
import { Input } from '../components'
import ProductForm from './ProductForm'

const ProductCreateForm = reduxForm({ form: 'PRODUCT_CREATE' })(ProductForm)
const ProductEditForm = reduxForm({ form: 'PRODUCT_EDIT' })(ProductForm)
const ProductFilterForm = reduxForm({ form: 'PRODUCT_FILTER', initialValues: { keyword: '' } })(
  (props) => <form className="navbar-form" role="search">
    <Field name="keyword" component={Input} placeholder="过滤出指定名称产品"/>
  </form>
)

class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [],
      open: false,
      createOpen: false,
      deleteConfirm: false,
    }
  }

  createForm =  null
  editForm = null

  componentDidMount() {
    this.props.dispatch(newInfoNotify('提示', '正在加载产品列表', 1000))
    ajax('/api/product').then((res) => {
      this.setState({
        products: res.data.products
      })
    }).catch((err) => {
      this.props.dispatch(newErrorNotify('警告', '加载产品列表出错', 1000))
    })
  }
  handleClose = () => {
    this.setState({open: false, createOpen: false})
  }
  handleDeleteConfirmOpen = (product) => {
    this.setState({deleteConfirm: true, current: product})
  }
  handleDeleteConfirmClose = () => {
    this.setState({deleteConfirm: false})
  }
  onCreate = (product) => {
    ajax('/api/product', {
      data: JSON.stringify(product),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      this.setState((prev) => ({
        products: prev.products.concat(product),
        createOpen: false,
      }))
    }).catch((err) => {
      this.props.dispatch(newErrorNotify('警告', '创建出错', 1000))
    })
  }
  onEdit = (product) => {
    ajax(`/api/product/${ product.number }`, {
      data: JSON.stringify(product),
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      this.setState((prev) => {
        const products = prev.products
        return {
          products: products.map((old) => old.number === product.number ? product : old),
          open: false,
        }
      })
    }).catch((err) => {
      this.props.dispatch(newErrorNotify('警告', '编辑出错', 1000))
    })
  }
  onDelete = () => {
    ajax(`/api/product/${ this.state.current.number }/delete`, {
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      this.setState((prev) => ({
        products: prev.products.filter((old) => old.number !== prev.current.number),
        deleteConfirm: false,
      }))
    }).catch((err) => {
      this.props.dispatch(newErrorNotify('警告', '删除出错', 1000))
    })
  }
  render() {
    return (
      <Card>
        <CardHeader
          title="产品信息维护"
          action={<>
            <Button
              color="primary"
              onClick={() => {
                this.setState({
                  createOpen: true,
                })
              }}>新增</Button>
          </>}
        />
        <CardContent>
          <ProductFilterForm/>
          <table className="table table-bordered" style={{ marginTop: '16px', width: '100%' }}>
            <thead>
            <tr>
              <th>编号</th>
              <th>类型</th>
              <th>型号</th>
              <th>名称</th>
              <th>规格</th>
              <th>理论重量（千克）</th>
              <th>计量单位</th>
              <th>换算单位</th>
              <th>换算比例</th>
              <th>是否需要换算</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {this.state.products.filter((product) => new RegExp(this.props.productFilter.keyword).test(product.name)).map((product) => (
              <tr key={product.number}>
                <td>{product.number}</td>
                <td>{product.type}</td>
                <td>{product.model}</td>
                <td>{product.name}</td>
                <td>{product.size}</td>
                <td>{product.weight}</td>
                <td>{product.countUnit}</td>
                <td>{product.unit}</td>
                <td>{product.scale}</td>
                <td>{product.isScaled ? '是' : '否'}</td>
                <td><button onClick={() => {
                  this.setState({
                    current: product,
                    open: true,
                  })
                }} >编辑</button>
                  <button onClick={() => {this.handleDeleteConfirmOpen(product)}} >删除</button></td>
              </tr>
            ))}
            </tbody>
          </table>
          <Dialog open={this.state.open}>
            <DialogTitle>编辑</DialogTitle>
            <DialogContent>
              <ProductEditForm
                initialValues={this.state.current}
                onSubmit={(d) => this.onEdit(d)}
                ref={editForm => this.editForm = editForm}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>取消</Button>
              <Button color="primary" onClick={() => this.editForm.submit()}>保存</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.createOpen}>
            <DialogTitle>新增</DialogTitle>
            <DialogContent>
              <ProductCreateForm
                onSubmit={(d) => this.onCreate(d)}
                ref={createForm => this.createForm = createForm}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose}>取消</Button>
              <Button color="primary" onClick={() => this.createForm.submit()}>保存</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={this.state.deleteConfirm}>
            <DialogTitle>确认删除</DialogTitle>
            <DialogContent>
              删除后可能造成不必要的麻烦，如果需要恢复，请新增一个编号相同的产品！
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDeleteConfirmClose}>取消</Button>
              <Button color="secondary" onClick={this.onDelete}>确定删除</Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    )
  }
}

export default connect(state => ({ productFilter: getFormValues('PRODUCT_FILTER')(state) }))(Product)