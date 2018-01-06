/**
 * Created by seal on 25/01/2017.
 */

//noinspection JSUnresolvedVariable
import React, { Component } from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form'
import { Input, DatePicker, FilterSelect, Select, TextArea } from '../components'
import { connect } from 'react-redux'
import {
  filterOption,
  transformArticle,
  toFixedWithoutTrailingZero as fixed,
  validator,
  calWeight,
  total_
} from '../utils'
import moment from 'moment'

const EntryTable = connect(
  state => ({
    ...transformArticle(state.system.articles.toArray()),
    products: state.system.products,
  })
)(({ fields, typeNameMap, nameArticleMap, products }) => {
  const add = () => {
    if (fields.length > 0) {
      let name = fields.get(fields.length - 1).name
      let type = fields.get(fields.length - 1).type
      fields.push({ type, name })
    } else {
      fields.push({ type: Object.keys(typeNameMap)[0] })
    }
  }

  const getNameOptions = (type) => {
    // 因为有的旧数据存在分类问题，所以这里加一个判断空的处理
    // 尽管我们可以把所有数据问题都解决掉，但是不可否认，我已经检查过一遍数据却还存在这个问题，所以还有隐含的问题
    if (typeNameMap[type]) {
      return typeNameMap[type].map(name => ({value: name, label: name, pinyin: nameArticleMap[name].pinyin}))
    } else {
      return []
    }

  }

  const getSizeOptions = (name) => {
    const article = nameArticleMap[name]
    return article ? article.sizes.map(size => ({ value: size, label: size }))
      : []
  }

  const getTotal = (index) => {
    try {
      const entry = fields.get(index)
      return total_(entry, products)
    } catch (e) {
      return 0
    }
  }

  const getWeight = (index) => {
    try {
      const entry = fields.get(index)
      return calWeight(entry, products)
    } catch (e) {
      return 0
    }

  }

  const getReport = () => {
    let totalObj = {}
    let weightObj = {}
    for (let i = 0; i < fields.length; i++) {
      let entry = fields.get(i)
      let total = getTotal(i)
      let weightTotal = getWeight(i)

      if (!entry.name) break // name 没填写的时候直接跳出

      if (totalObj[entry.name]) {
        totalObj[entry.name] += Number(total)
        weightObj[entry.name] += weightTotal
      } else {
        totalObj[entry.name] = Number(total)
        weightObj[entry.name] = weightTotal
      }
    }

    let total = []
    /* eslint guard-for-in: off */
    for (let i in totalObj) {
      total.push({
        name : i,
        total: totalObj[i],
        weight: weightObj[i],
        unit: nameArticleMap[i].unit
      })
    }

    return total
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
          <th>重量</th>
          <th>小计</th>
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
            <td>
              <Field
                name={`${entry}.type`}
                component={Select}
                style={{minWidth: '6em'}}
              >
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
                validate={validator.required}
                filterOption={filterOption}
                placeholder="名称"
                style={{minWidth: '7em'}}
              />
            </td>
            <td>
              <Field
                name={`${entry}.size`}
                component={FilterSelect}
                options={getSizeOptions(fields.get(index).name)}
                validate={validator.required}
                placeholder="规格"
                style={{minWidth: '11em'}}
              />
            </td>
            <td><Field name={`${entry}.count`} component={Input} validate={validator.required}/></td>
            <td>{fixed(getWeight(index))}</td>
            <td>{fixed(getTotal(index))}</td>
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
          <li key={index} className="list-group-item">
            {report.name} {fixed(report.total)} {report.unit}
            {report.weight === 0 ? ' *' : ' ' + fixed(report.weight / 1000, 3)} 吨
          </li>
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
              options={this.props.projects.map(project => ({
                value: project._id,
                label: project.company + project.name,
                pinyin: project.pinyin
              }))}
              filterOption={filterOption}
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
          <label className="control-label col-md-1">整理费用</label>
          <div className="col-md-3">
            <Field name="fee.sort" component={Input}/>
          </div>
        </div>
        <div className="form-group">
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
          <label className="control-label col-md-1">备注</label>
          <div className="col-md-11">
            <Field name="comments" component={TextArea}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-12">
            <FieldArray name="entries" component={EntryTable}/>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-12">
            <button type="submit" className="btn btn-primary btn-block">保存</button>
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