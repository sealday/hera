/**
 * Created by seal on 25/01/2017.
 */

//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form'
import { Input, DatePicker, FilterSelect, Select } from '../components'
import { connect } from 'react-redux'
import { transformArticle,total_, toFixedWithoutTrailingZero as fixed, validator } from '../utils'
import moment from 'moment'

const EntryTable = connect(
  state => ({
    ...transformArticle(state.system.articles.toArray()),
  })
)(({ fields, typeNameMap, nameArticleMap }) => {
  const add = () => {
    if (fields.length > 0) {
      let name = fields.get(fields.length - 1).name
      fields.push({ type: '租赁类', name })
    } else {
      fields.push({ type: '租赁类' })
    }
  }

  const getNameOptions = (type) => {
    return typeNameMap[type].map(name => ({ value: name, label: name }))
  }

  const getSizeOptions = (name) => {
    const article = nameArticleMap[name]
    return article ? article.sizes.map(size => ({ value: size, label: size }))
      : []
  }

  const getTotal = (index) => {
    try {
      const entry = fields.get(index)
      const total = total_(entry)
      return isNaN(total) ? false : fixed(total)
    } catch (e) {
      return false
    }
  }

  // 下面进行数字计算的函数的原则是，如果能算出数字，返回数字，否则返回 false
  // 除不尽的情况下不处理
  const getUnit = (index) => {
    const entry = fields.get(index)
    const article = nameArticleMap[entry.name]
    return article ? article.unit : false
  }

  const getSum = (index) => {
    const entry = fields.get(index)
    const sum = getTotal(index) * entry.price
    return isNaN(sum) ? false : sum
  }

  const getFreight = (index) => {
    const entry = fields.get(index)
    const freight = entry.freightPrice * entry.freightCount
    return isNaN(freight) ? false : freight
  }

  const getMixPrice = (index) => {
    const total = getTotal(index)
    return total ? getMixSum(index) / total : false
  }

  const getMixSum = (index) => {
    const sum = getSum(index)
    const freight = getFreight(index)
    const mixSum = (sum ? sum : 0) + (freight ? freight: 0)
    return mixSum ? mixSum : false
  }

  const getReport = () => {
    let totalObj = {}
    for (let i = 0; i < fields.length; i++) {
      let entry = fields.get(i)
      let total = getTotal(i)
      total = total ? 0 : total

      if (!entry.name) break // name 没填写的时候直接跳出

      if (totalObj[entry.name]) {
        totalObj[entry.name] += Number(total)
      } else {
        totalObj[entry.name] = Number(total)
      }
    }

    let total = []
    /* eslint guard-for-in: off */
    for (let i in totalObj) {
      total.push({
        name : i,
        total: totalObj[i],
        unit: nameArticleMap[i].unit
      })
    }

    return total
  }

  return (
    <div className="panel panel-default">
      <table className="table table-bordered" id="purchase-table">
        <thead>
        <tr>
          <th>类型</th>
          <th>名称</th>
          <th>规格</th>
          <th>数量</th>
          <th>小计</th>
          <th>单位</th>
          <th>单价</th>
          <th>金额</th>
          <th>吨/趟</th>
          <th>运费单位</th>
          <th>运费单价</th>
          <th>运费</th>
          <th>综合单价</th>
          <th>综合金额</th>
          <th>备注</th>
          <th>
            <button
              type="button"
              onClick={add}
              className="btn btn-default">增加</button>
          </th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {fields.map((entry, index) =>
          <tr key={index}>
            <td style={{minWidth: '6em'}}>
              <Field name={`${entry}.type`} component={Select}>
                {Object.keys(typeNameMap).map((type, index) => (
                  <option key={index}>{type}</option>
                ))}
              </Field>
            </td>
            <td style={{minWidth: '7em'}}>
              <Field
                name={`${entry}.name`}
                component={FilterSelect}
                options={getNameOptions(fields.get(index).type)}
                validate={validator.required}
                placeholder="名称"
              />
            </td>
            <td style={{minWidth: '11em'}}>
              <Field
                name={`${entry}.size`}
                component={FilterSelect}
                options={getSizeOptions(fields.get(index).name)}
                validate={validator.required}
                placeholder="规格"
              />
            </td>
            <td><Field name={`${entry}.count`} component={Input} validate={validator.required}/></td>
            <td>{fixed(getTotal(index))}</td>
            <td>{getUnit(index)}</td>
            <td><Field name={`${entry}.price`} component={Input}/></td>
            <td>{fixed(getSum(index))}</td>
            <td><Field name={`${entry}.freightCount`} component={Input}/></td>
            <td style={{minWidth: '5em'}}>
              <Field name={`${entry}.freightUnit`} component={Select}>
                <option>吨</option>
                <option>趟</option>
              </Field>
            </td>
            <td><Field name={`${entry}.freightPrice`} component={Input}/></td>
            <td>{fixed(getFreight(index))}</td>
            <td>{fixed(getMixPrice(index))}</td>
            <td>{fixed(getMixSum(index))}</td>
            <td><Field name={`${entry}.comments`} component={Input}/></td>
            <td>
              <button
                type="button"
                onClick={add}
                className="btn btn-default">增加</button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => fields.remove(index)}>删除</button>
            </td>
          </tr>
        )}
        </tbody>
      </table>
      <ul className="list-group">
        {getReport().map((report, index) => (
          <li key={index} className="list-group-item">{report.name} {report.total} {report.unit}</li>
        ))}
      </ul>
    </div>
  )
})


class TransferForm extends Component {
  render() {
    return (
      <form className="form-horizontal" onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label className="control-label col-md-1">项目部</label>
          <div className="col-md-3">
            <Field
              name="project"
              component={FilterSelect}
              validate={validator.required}
              options={this.props.projects.map(project => ({ value: project._id, label: project.company + project.name }))}
              placeholder="请选择项目" />
          </div>
          <label className="control-label col-md-1">日期</label>
          <div className="col-md-3">
            <Field name="outDate" component={DatePicker}/>
          </div>
          <label className="control-label col-md-1">原始单号</label>
          <div className="col-md-3">
            <Field name="originalOrder" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">车号</label>
          <div className="col-md-3">
            <Field name="carNumber" component={Input}/>
          </div>
          <label className="control-label col-md-1">运费</label>
          <div className="col-md-3">
            <Field name="fee.car" component={Input}/>
          </div>
          <label className="control-label col-md-1">备注</label>
          <div className="col-md-3">
            <Field name="comments" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-md-1">整理费用</label>
          <div className="col-md-3">
            <Field name="fee.sort" component={Input}/>
          </div>
          <label className="control-label col-md-1">其他费用1</label>
          <div className="col-md-3">
            <Field name="fee.other1" component={Input}/>
          </div>
          <label className="control-label col-md-1">其他费用2</label>
          <div className="col-md-3">
            <Field name="fee.other2" component={Input}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-12">
            <FieldArray name="entries" component={EntryTable}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-12">
            <button type="submit" className="btn btn-primary btn-block">提交</button>
          </div>
        </div>
      </form>
    );
  }
}

TransferForm = reduxForm({
  form: 'purchase',
  initialValues: {
    outDate: moment()
  }
})(TransferForm)

const mapStateToProps = state => ({
  projects: state.system.projects.toArray(),
  stocks: state.store.stocks,
})


export default connect(mapStateToProps)(TransferForm);