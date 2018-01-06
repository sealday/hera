import React from 'react'
import { reduxForm } from 'redux-form'
import ProductForm from './ProductForm'
import shortId from 'shortid'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const ProductCreateForm = reduxForm({ form: 'PRODUCT_CREATE', action: '新增' })(ProductForm)
const ProductEditForm = reduxForm({ form: 'PRODUCT_EDIT', action: '保存' })(ProductForm)

class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: [{
        number: 1,
        name: '钢管',
        size: '0.4',
        weight: 3,
        countUnit: '根',
        unit: '米',
        scale: 0.4,
      }],
      open: false,
      deleteConfirm: false,
    }
  }
  handleOpen = () => {
    this.setState({open: true})
  }
  handleClose = () => {
    this.setState({open: false})
  }
  handleDeleteConfirmOpen = (product) => {
    this.setState({deleteConfirm: true, current: product})
  }
  handleDeleteConfirmClose = () => {
    this.setState({deleteConfirm: false})
  }
  onCreate = (product) => {
    this.setState((prev) => ({ products: prev.products.concat(product) }))
  }
  onEdit = (product) => {
    this.setState((prev) => {
      const products = prev.products
      return {
        products: products.map((old) => old.number === product.number ? product : old),
        open: false,
      }
    })
  }
  onDelete = () => {
    this.setState((prev) => ({
      products: prev.products.filter((old) => old.number !== prev.current.number),
      deleteConfirm: false,
    }))
  }
  render() {
    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onClick={this.handleClose}
      />,
    ]
    const deleteActions = [
      <button
        className="btn btn-default"
        onClick={this.handleDeleteConfirmClose}
      >取消</button>,
      <button
        className="btn btn-danger h-left-margin-1-em"
        onClick={this.onDelete}
      >确定删除</button>,
    ]
    return (
      <div>
        <h2 className="page-header">产品信息维护</h2>
        <ProductCreateForm onSubmit={(d) => this.onCreate(d)}/>
        <table className="table">
          <thead>
          <tr>
            <th>编号</th>
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
          {this.state.products.map((product) => (
            <tr key={shortId.generate()}>
              <td>{product.number}</td>
              <td>{product.model}</td>
              <td>{product.name}</td>
              <td>{product.size}</td>
              <td>{product.weight}</td>
              <td>{product.countUnit}</td>
              <td>{product.unit}</td>
              <td>{product.scale}</td>
              <td>{product.isScaled ? '是' : '否'}</td>
              <td style={{paddingBottom: '4px', paddingTop: '4px'}}><button className="btn btn-primary" onClick={() => {
                this.setState({
                  current: product,
                  open: true,
                })
              }} >编辑</button>
              <button style={{marginLeft: '1em'}} className="btn btn-danger" onClick={() => {
                this.handleDeleteConfirmOpen(product)
              }} >删除</button></td>
            </tr>
          ))}
          </tbody>
        </table>
        <MuiThemeProvider>
        <Dialog
          title="编辑"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <ProductEditForm initialValues={this.state.current} onSubmit={(d) => this.onEdit(d)}/>
        </Dialog>
        </MuiThemeProvider>
        <MuiThemeProvider>
          <Dialog
            title="确认删除"
            actions={deleteActions}
            modal={true}
            open={this.state.deleteConfirm}
          >
            删除后可能造成不必要的麻烦，如果需要恢复，请新增一个编号相同的产品！
          </Dialog>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default Product