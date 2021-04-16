import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { flatMap } from 'lodash'
import { Tabs } from 'antd'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core'

import { DatePicker, Input, Select, MaskedInput } from '../components'

class TransportForm extends React.Component {
  render() {
    const { record, title, action, handleSubmit, projects: imProjects, change } = this.props
    const inProject = imProjects.get(record.inStock)
    const outProject = imProjects.get(record.outStock)
    const projects = imProjects.toArray()

    return (
      <Card>
        <CardHeader title={title} action={action} />
        <CardContent>
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="col-md-2 control-label">承租日期</label>
              <div className="col-md-4">
                <Field name="off-date" component={DatePicker}/>
              </div>
              <label className="col-md-2 control-label">到货日期</label>
              <div className="col-md-4">
                <Field name="arrival-date" component={DatePicker}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-2 control-label">吨/趟</label>
              <div className="col-md-4">
                <Field name="weight" component={Input}/>
              </div>
              <label className="col-md-2 control-label">单价</label>
              <div className="col-md-4">
                <Field name="price" component={Input}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-2 control-label">附加价格</label>
              <div className="col-md-4">
                <Field name="extraPrice" component={Input}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-2 control-label">付款方</label>
              <div className="col-md-4">
                <Field name="payer" component={Select}>
                  <option>{this.props.optionA}</option>
                  <option>{this.props.optionB}</option>
                </Field>
              </div>
              <label className="col-md-2 control-label">付款约定</label>
              <div className="col-md-4">
                <Field name="pay-info" component={Input}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-2 control-label">付款日期</label>
              <div className="col-md-4">
                <Field name="payDate" component={DatePicker}/>
              </div>
            </div>
            <Tabs defaultActiveKey="0" tabPosition="top">
              <Tabs.TabPane tab="快速选择" key="0">
                <div className="form-group">
                  <label className="col-md-2 control-label">收款人信息</label>
                  <div className="col-md-10">
                    <Field name="a" component={Select} onChange={(_, newValue) => {
                      const [bank, name, account] = newValue.split(',')
                      change('bank', bank)
                      change('payee', name)
                      change('account', account)
                    }}>
                      {flatMap(projects, project => project.banks)
                        .filter(bank => bank.bank)
                        .map(payee =>
                          <option
                            key={[payee.bank, payee.name, payee.account].join(',')}
                            value={[payee.bank, payee.name, payee.account].join(',')}>
                            {`${payee.bank} ${payee.name} ${payee.account}`}
                          </option>
                        )}
                    </Field>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-2 control-label">发货方联系人</label>
                  <div className="col-md-10">
                    <Field
                      name="b"
                      component={Select}
                      onChange={(_, newValue) => {
                        const [name, phone] = newValue.split(',')
                        change('delivery-contact', name)
                        change('delivery-phone', phone)
                      }}
                    >
                      {outProject.contacts.map(contact =>
                        <option
                          key={[contact.name, contact.phone].join(',')}
                          value={[contact.name, contact.phone].join(',')}>
                          {`${contact.name} ${contact.phone}`}
                        </option>
                      )}
                    </Field>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-2 control-label">收货方联系人</label>
                  <div className="col-md-10">
                    <Field
                      name="c"
                      component={Select}
                      onChange={(_, newValue) => {
                        const [name, phone] = newValue.split(',')
                        change('receiving-contact', name)
                        change('receiving-phone', phone)
                      }}
                    >
                      {inProject.contacts.map(contact =>
                        <option
                          key={[contact.name, contact.phone].join(',')}
                          value={[contact.name, contact.phone].join(',')}>
                          {`${contact.name} ${contact.phone}`}
                        </option>
                      )}
                    </Field>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-2 control-label">承运方</label>
                  <div className="col-md-10">
                    <Field
                      name="d"
                      component={Select}
                      onChange={(_, newValue) => {
                        const [company, name, phone, number] = newValue.split(',')
                        change('carrier-party', company)
                        change('carrier-name', name)
                        change('carrier-phone', phone)
                        change('carrier-id', number)
                      }}
                    >
                      {flatMap(projects.filter(project => project.type === '承运商'),
                        project => project.contacts
                          .map(contact => ({...contact, company: project.company + project.name})))
                        .map(contact =>
                          <option
                            key={[contact.company, contact.name, contact.phone, contact.number].join(',')}
                            value={[contact.company, contact.name, contact.phone, contact.number].join(',')}>
                            {`${contact.company} ${contact.name} ${contact.phone} ${contact.number}`}
                          </option>
                        )}
                    </Field>
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="手工录入" key="1">
                <div className="form-group">
                  <label className="col-md-2 control-label">收款人</label>
                  <div className="col-md-4">
                    <Field name="payee" component={Input}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-2 control-label">收款人开户行</label>
                  <div className="col-md-4">
                    <Field name="bank" component={Input}/>
                  </div>
                  <label className="col-md-2 control-label">收款人账号</label>
                  <div className="col-md-4">
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
                  <label className="col-md-2 control-label">发货方联系人</label>
                  <div className="col-md-4">
                    <Field name="delivery-contact" component={Input}/>
                  </div>
                  <label className="col-md-2 control-label">发货方联系电话</label>
                  <div className="col-md-4">
                    <Field name="delivery-phone" component={Input}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-2 control-label">收货方联系人</label>
                  <div className="col-md-4">
                    <Field name="receiving-contact" component={Input}/>
                  </div>
                  <label className="col-md-2 control-label">收货方联系电话</label>
                  <div className="col-md-4">
                    <Field name="receiving-phone" component={Input}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-2 control-label">承运方单位</label>
                  <div className="col-md-4">
                    <Field name="carrier-party" component={Input}/>
                  </div>
                  <label className="col-md-2 control-label">承运方司机</label>
                  <div className="col-md-4">
                    <Field name="carrier-name" component={Input}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-2 control-label">承运方联系号码</label>
                  <div className="col-md-10">
                    <Field name="carrier-phone" component={Input}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-2 control-label">司机身份证号</label>
                  <div className="col-md-10">
                    <Field name="carrier-id" component={Input}/>
                  </div>
                </div>
              </Tabs.TabPane>
            </Tabs>
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
