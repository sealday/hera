import React from 'react'
import Form from './PriceForm'
import { reduxForm } from 'redux-form'

const PriceForm = reduxForm({ form: 'PRICE_CREATE', action: 'create' })(Form)

class PriceCreate extends React.Component {
  render() {
    return (
      <div>
        <h2 className="page-header">创建</h2>
        <PriceForm/>
      </div>
    )
  }
}

export default PriceCreate