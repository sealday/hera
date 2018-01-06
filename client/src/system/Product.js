import React from 'react'
import { reduxForm } from 'redux-form'
import ProductForm from './ProductForm'
import shortId from 'shortid'

const ProductCreateForm = reduxForm({ form: 'PRODUCT_CREATE' })(ProductForm)
const ProductEditForm = reduxForm({ form: 'PRODUCT_EDIT' })(ProductForm)

class Product extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: []
    }
  }
  onCreate(product) {
    this.setState((prev) => ({ products: prev.products.concat(product) }))
  }
  render() {
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
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Product