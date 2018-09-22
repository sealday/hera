import React, {Fragment} from 'react'
import { Field } from 'redux-form'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import {
  filterOption,
  transformArticle,
  toFixedWithoutTrailingZero as fixed,
  validator,
  calWeight,
  total_
} from '../utils'
import { Input, FilterSelect, Select, ReportFooter } from '../components'

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

  return (
    [
      <Table className="table">
        <TableHead>
        <TableRow>
          <TableCell>类型</TableCell>
          <TableCell>名称</TableCell>
          <TableCell>规格</TableCell>
          <TableCell>数量</TableCell>
          {mode === 'S' && <TableCell>单价</TableCell>}
          <TableCell>重量</TableCell>
          <TableCell>小计</TableCell>
          <TableCell>备注</TableCell>
          <TableCell>
            <Button
              variant="raised"
              color="primary"
              type="button"
              onClick={add}
            >增加</Button>
          </TableCell>
          <TableCell/>
        </TableRow>
        </TableHead>
        <tbody>
        {fields.map((entry, index) =>
          fields.get(index).mode === mode && <TableRow key={index}>
            <TableCell>
              <Field
                name={`${entry}.type`}
                component={Select}
                style={{minWidth: '6em'}}
              >
                {Object.keys(typeNameMap).map((type, index) => (
                  <option key={index}>{type}</option>
                ))}
              </Field>
            </TableCell>
            <TableCell>
              <Field
                name={`${entry}.name`}
                component={FilterSelect}
                options={getNameOptions(fields.get(index).type)}
                validate={validator.required}
                filterOption={filterOption}
                placeholder="名称"
                style={{minWidth: '7em'}}
              />
            </TableCell>
            <TableCell>
              <Field
                name={`${entry}.size`}
                component={FilterSelect}
                options={getSizeOptions(fields.get(index).name)}
                validate={validator.required}
                placeholder="规格"
                style={{minWidth: '11em'}}
              />
            </TableCell>
            <TableCell><Field name={`${entry}.count`} component={Input} validate={validator.required}/></TableCell>
            {mode === 'S' && <TableCell><Field name={`${entry}.price`} component={Input} validate={validator.required}/></TableCell>}
            <TableCell>{fixed(getWeight(index))}</TableCell>
            <TableCell>{fixed(getTotal(index))}</TableCell>
            <TableCell><Field name={`${entry}.comments`} component={Input}/></TableCell>
            <TableCell>
              <Button
                variant="raised"
                color="primary"
                type="button"
                onClick={add}
              >增加</Button>
            </TableCell>
            <TableCell>
              <Button
                color="secondary"
                type="button"
                onClick={() => fields.remove(index)}
              >删除</Button>
            </TableCell>
          </TableRow>
        )}
        </tbody>
      </Table>,
      <ReportFooter report={getReport()} />,
    ]
  )
})

export default TransferEntryTable
