import React from 'react';
import { Field } from 'redux-form'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

import {
  filterOption,
  transformArticle,
  toFixedWithoutTrailingZero as fixed,
  validator,
  calWeight,
  total_
} from '../utils'
import { Input, FilterSelect, Select } from '../components'

const TransferEntryTable = connect(
  state => ({
    ...transformArticle(state.system.articles.toArray()),
    products: state.system.products,
  })
)(({ fields, typeNameMap, nameArticleMap, products, mode }) => {
  const add = () => {
    if (fields.length > 0) {
      let name = fields.get(fields.length - 1).name
      let type = fields.get(fields.length - 1).type
      fields.push({ type, name, mode })
    } else {
      fields.push({ type: Object.keys(typeNameMap)[0], mode })
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
      if (entry.mode !== mode) {
        continue
      }
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

  return [
      <table className="table">
        <thead>
        <tr>
          <th>类型</th>
          <th>名称</th>
          <th>规格</th>
          <th>数量</th>
          {mode === 'S' && <th>单价</th>}
          <th>重量</th>
          <th>小计</th>
          <th>备注</th>
          <th>
            <Button
              variant="raised"
              color="primary"
              type="button"
              onClick={add}
            >增加</Button>
          </th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {fields.map((entry, index) =>
          fields.get(index).mode === mode && <tr key={index}>
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
            {mode === 'S' && <td><Field name={`${entry}.price`} component={Input} validate={validator.required}/></td>}
            <td>{fixed(getWeight(index))}</td>
            <td>{fixed(getTotal(index))}</td>
            <td><Field name={`${entry}.comments`} component={Input}/></td>
            <td>
              <Button
                variant="raised"
                color="primary"
                type="button"
                onClick={add}
              >增加</Button>
            </td>
            <td>
              <Button
                color="secondary"
                type="button"
                onClick={() => fields.remove(index)}
              >删除</Button>
            </td>
          </tr>
        )}
        </tbody>
      </table>,
      <ul className="list-group">
        {getReport().map((report, index) => (
          <li key={index} className="list-group-item">
            {report.name} {fixed(report.total)} {report.unit}
            {report.weight === 0 ? ' *' : ' ' + fixed(report.weight / 1000, 3)} 吨
          </li>
        ))}
      </ul>
  ]
})

export default TransferEntryTable
