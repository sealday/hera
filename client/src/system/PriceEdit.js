import React from 'react'
import Form from './PriceForm'
import { reduxForm } from 'redux-form'

const PriceForm = reduxForm({ form: 'PRICE_EDIT', action: 'edit' })(Form)

class PriceEdit extends React.Component {
  render() {
    return (
      <div>
        <h2 className="page-header">价格方案编辑</h2>
        <PriceForm/>
      </div>
    )
  }
}

export default PriceEdit