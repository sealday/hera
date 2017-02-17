/**
 * Created by seal on 25/01/2017.
 */

import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { DatePicker, Input, Select } from '../components'

class TransportForm extends React.Component {
  render() {
    const { record } = this.props
    return (
      <form className="form-horizontal" onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label className="col-sm-2 control-label">承租日期</label>
          <div className="col-sm-4">
            <Field name="off-date" component={DatePicker}/>
          </div>
          <label className="col-sm-2 control-label">到货日期</label>
          <div className="col-sm-4">
            <Field name="arrival-date" component={DatePicker}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">顿/趟</label>
          <div className="col-sm-4">
            <Field name="weight" component={Input}/>
          </div>
          <label className="col-sm-2 control-label">单价</label>
          <div className="col-sm-4">
            <Field name="price" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">付款方</label>
          <div className="col-sm-4">
            <Field name="payer" component={Select}>
              <option>{this.props.optionA}</option>
              <option>{this.props.optionB}</option>
            </Field>
          </div>
          <label className="col-sm-2 control-label">付款约定</label>
          <div className="col-sm-4">
            <Field name="pay-info" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">付款日期</label>
          <div className="col-sm-4">
            <Field name="payDate" component={DatePicker}/>
          </div>
          <label className="col-sm-2 control-label">收款人</label>
          <div className="col-sm-4">
            <Field name="payee" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">收款人开户行</label>
          <div className="col-sm-4">
            <Field name="bank" component={Input}/>
          </div>
          <label className="col-sm-2 control-label">收款人账号</label>
          <div className="col-sm-4">
            <Field name="account" component={Input}/>
          </div>
        </div>
        {record.type === '采购' &&
        <div className="form-group">
          <label className="col-sm-2 control-label">发货方单位</label>
          <div className="col-sm-4">
            <Field name="delivery-party" component={Input}/>
          </div>
          <label className="col-sm-2 control-label">发货人地址</label>
          <div className="col-sm-4">
            <Field name="delivery-address" component={Input}/>
          </div>
        </div>
        }
        <div className="form-group">
          <label className="col-sm-2 control-label">发货方联系人</label>
          <div className="col-sm-4">
            <Field name="delivery-contact" component={Input}/>
          </div>
          <label className="col-sm-2 control-label">发货方联系电话</label>
          <div className="col-sm-4">
            <Field name="delivery-phone" component={Input}/>
          </div>
        </div>
        {record.type === '销售' &&
        <div className="form-group">
          <label className="col-sm-2 control-label">收货方单位</label>
          <div className="col-sm-4">
            <Field name="receiving-party" component={Input}/>
          </div>
          <label className="col-sm-2 control-label">收货方地址</label>
          <div className="col-sm-4">
            <Field name="receiving-address" component={Input}/>
          </div>
        </div>
        }
        <div className="form-group">
          <label className="col-sm-2 control-label">收货方联系人</label>
          <div className="col-sm-4">
            <Field name="receiving-contact" component={Input}/>
          </div>
          <label className="col-sm-2 control-label">收货方联系电话</label>
          <div className="col-sm-4">
            <Field name="receiving-phone" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">承运方单位</label>
          <div className="col-sm-4">
            <Field name="carrier-party" component={Input}/>
          </div>
          <label className="col-sm-2 control-label">承运方司机</label>
          <div className="col-sm-4">
            <Field name="carrier-name" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">承运方联系号码</label>
          <div className="col-sm-10">
            <Field name="carrier-phone" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">司机身份证号</label>
          <div className="col-sm-10">
            <Field name="carrier-id" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <button className="btn btn-primary btn-block">保存</button>
        </div>
      </form>
    );
  }
}


TransportForm = reduxForm({
  form: 'transport'
})(TransportForm)

export default TransportForm;
