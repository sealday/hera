import React from 'react'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
import {
  Button,
} from '@material-ui/core'

import { FilterSelect, Input, Select } from '../components'
import { validator, filterOption, transformArticle } from '../utils'

const WeightEntry = connect(
  state => ({
    articles: state.system.articles,
  })
)(({ fields, articles }) => {
  const { typeNameMap, nameArticleMap } = transformArticle(articles.toArray())
  const add = () => {
    if (fields.length > 0) {
      const name = fields.get(fields.length - 1).name
      const type = fields.get(fields.length - 1).type
      fields.push({
        type,
        name,
      })
    } else {
      fields.push({
        type: Object.keys(typeNameMap)[0],
      })
    }
  }

  const getNameOptions = (type) => {
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

  return (
    <>
      <table className="table" style={{ width: '100%', marginTop: '16px' }}>
        <thead>
        <tr>
          <th>类型</th>
          <th>名称</th>
          <th>规格</th>
          <th>重量</th>
          <th>备注</th>
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
            <td><Field
              name={`${entry}.unitWeight`}
              component={Input}
              validate={[validator.required, validator.num]}
            /></td>
            <td><Field name={`${entry}.comments`} component={Input}/></td>
            <td>
              <Button
                type="button"
                color="secondary"
                size="small"
                onClick={() => fields.remove(index)}>删除</Button>
            </td>
          </tr>
        )}
        </tbody>
      </table>
      <Button style={{ marginTop: '8px' }} onClick={add} color="primary" variant="outlined" fullWidth>增加</Button>
    </>
  )
})

export default WeightEntry
