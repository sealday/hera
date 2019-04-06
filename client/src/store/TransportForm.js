import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { flatMap } from 'lodash'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import { DatePicker, Input, Select, MaskedInput } from '../components'

class TransportForm extends React.Component {
  render() {
    const { record, title, action, handleSubmit, projects: imProjects } = this.props
    const inProject = imProjects.get(record.inStock)
    const outProject = imProjects.get(record.outStock)
    const projects = imProjects.toArray()

    return (
      <Card>
        <CardHeader title={title} action={action} />
        <CardContent>
          <form className="form-horizontal" onSubmit={handleSubmit}>
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
              <label className="col-sm-2 control-label">吨/趟</label>
              <div className="col-sm-4">
                <Field name="weight" component={Input}/>
              </div>
              <label className="col-sm-2 control-label">单价</label>
              <div className="col-sm-4">
                <Field name="price" component={Input}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">附加价格</label>
              <div className="col-sm-4">
                <Field name="extraPrice" component={Input}/>
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
                <Field
                  name="account"
                  component={MaskedInput}
                  guide={false}
                  mask={[
                    /\d/, /\d/, /\d/, /\d/, ' ',
                    /\d/, /\d/, /\d/, /\d/, ' ',
                    /\d/, /\d/, /\d/, /\d/, ' ',
                    /\d/, /\d/, /\d/, /\d/, ' ',
                    /\d/, /\d/, /\d/,
                  ]}
                />
              </div>
            </div>
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
              <label className="col-sm-2 control-label">收款人信息</label>
              <div className="col-sm-10">
                <Field name="a" component={Select}>
                  {flatMap(projects, project => project.banks)
                    .filter(bank => bank.bank).map(payee => <option>
                      {`${payee.bank} ${payee.name} ${payee.account}`}
                    </option>)}
                </Field>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">发货方联系人</label>
              <div className="col-sm-10">
                <Field name="b" component={Select}>
                  {outProject.contacts.map(contact => <option>
                    {`${contact.name} ${contact.phone}`}
                  </option>)}
                </Field>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">收货方联系人</label>
              <div className="col-sm-10">
                <Field name="c" component={Select}>
                  {inProject.contacts.map(contact => <option>
                    {`${contact.name} ${contact.phone}`}
                  </option>)}
                </Field>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">承运方</label>
              <div className="col-sm-10">
                <Field name="d" component={Select}>
                  {flatMap(projects.filter(project => project.type === '承运商'),
                    project => project.contacts)
                    .map(contact => <option>
                      {`${contact.name} ${contact.phone} ${contact.number}`}
                    </option>)}
                </Field>
              </div>
            </div>
            <Button variant="contained" color="primary" fullWidth type="submit">保存</Button>
          </form>
        </CardContent>
      </Card>
    )
  }
}


TransportForm = reduxForm({
  form: 'transport'
})(TransportForm)

const mapStateToProps = state => ({
  projects: state.system.projects,
})

export default connect(mapStateToProps)(TransportForm)
