import React from 'react'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { FilterSelect, Input, Select } from '../components'
import { validator, filterOption, transformArticle } from '../utils'

const PriceEntry = connect(
  state => ({
    ...transformArticle(state.system.articles.toArray()),
  })
)(({ fields, typeNameMap, nameArticleMap}) => {
  const add = () => {
    if (fields.length > 0) {
      const name = fields.get(fields.length - 1).name
      const productType = fields.get(fields.length - 1).productType
      fields.push({
        productType,
        name,
        type: '数量',
        level: '产品',
      })
    } else {
      fields.push({
        productType: Object.keys(typeNameMap)[0],
        type: '数量',
        level: '产品',
      })
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

  const sizeEnabled = (index) => {
    return fields.get(index).level === '规格'
  }

  return (
    <div className="panel panel-default">
      <table className="table">
        <thead>
        <tr>
          <th>类型</th>
          <th>名称</th>
          <th>规格</th>
          <th>定价层级</th>
          <th>单价</th>
          <th>计算类型</th>
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
                name={`${entry}.productType`}
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
                options={getNameOptions(fields.get(index).productType)}
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
                validate={sizeEnabled(index) ? [validator.required] : []}
                disabled={!sizeEnabled(index)}
                placeholder="规格"
                style={{minWidth: '11em'}}
              />
            </td>
            <td>
              <Field name={`${entry}.level`} component={Select} style={{ minWidth: '15em' }}>
                <option value="产品">定价到产品</option>
                <option value="规格">定价到规格</option>
              </Field>
            </td>
            <td><Field
              name={`${entry}.unitPrice`}
              component={Input}
              validate={[validator.required, validator.num]}
            /></td>
            <td>
              <Field name={`${entry}.type`} component={Select}>
                <option value="数量">根据数量计算</option>
                <option value="换算数量">根据换算后数量计算</option>
                <option value="重量">根据重量计算（元/千克）</option>
              </Field>
            </td>
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
    </div>
  )
})

export default PriceEntry
