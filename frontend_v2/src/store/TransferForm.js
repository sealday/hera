/**
 * Created by seal on 25/01/2017.
 */

//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form'
import { Input, DatePicker, FilterSelect, Select } from '../components'
import { connect } from 'react-redux'
import { transformArticle, calculateSize, toFixedWithoutTrailingZero as fixed } from '../utils'
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
      return fixed(entry.count * calculateSize(entry.size))
    } catch (e) {
      return '错误'
    }
  }

  const getReport = () => {
    let totalObj = {}
    for (let i = 0; i < fields.length; i++) {
      let entry = fields.get(i)
      let total = getTotal(i)
      total = total === '错误' ? 0 : total

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

  const getStock = () => {
    return 0
  }

  return (
    <div className="panel panel-default">
      <table className="table table-bordered">
        <thead>
        <tr>
          <th>类型</th>
          <th>名称</th>
          <th>规格</th>
          <th>数量</th>
          <th>小计</th>
          <th>
            <button
              type="button"
              onClick={add}
              className="btn btn-default">增加</button>
          </th>
        </tr>
        </thead>
        <tbody>
        {fields.map((entry, index) =>
          <tr key={index}>
            <td>
              <Field name={`${entry}.type`} component={Select}>
                {Object.keys(typeNameMap).map((type, index) => (
                  <option key={index}>{type}</option>
                ))}
              </Field>
            </td>
            <td>
              <Field
                name={`${entry}.name`}
                component={FilterSelect}
                options={getNameOptions(fields.get(index).type)}
                placeholder="名称"
              />
            </td>
            <td>
              <Field
                name={`${entry}.size`}
                component={FilterSelect}
                options={getSizeOptions(fields.get(index).name)}
                placeholder="规格"
              />
            </td>
            <td><Field name={`${entry}.count`} component={Input}/></td>
            <td>{getTotal(index)}</td>
            <td>
              <button
                type="button"
                onClick={add}
                className="btn btn-default">增加</button>
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
  form: 'transfer',
  initialValues: {
    outDate: moment()
  }
})(TransferForm)

const mapStateToProps = state => ({
  projects: state.system.projects.toArray(),
  stocks: state.store.stocks,
})


export default connect(mapStateToProps)(TransferForm);