import React from 'react'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
// import { Button } from '@material-ui/core'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FilterSelect, Input, Select } from '../../components'
import { validator, filterOption, transformArticle } from '../../utils'

const RepairEntry = connect(state => ({
	articles: state.system.articles
}))(({ fields, articles }) => {
	const { typeNameMap, nameArticleMap } = transformArticle(articles.toArray())
	const add = () => {
		if (fields.length > 0) {
			const name = fields.get(fields.length - 1).name
			const type = fields.get(fields.length - 1).type
			fields.push({
				type,
				name
			})
		} else {
			fields.push({
				type: Object.keys(typeNameMap)[0]
			})
		}
	}

	const getNameOptions = type => {
		if (typeNameMap[type]) {
			return typeNameMap[type].map(name => ({ value: name, label: name, pinyin: nameArticleMap[name].pinyin }))
		} else {
			return []
		}
	}

	const getSizeOptions = name => {
		const article = nameArticleMap[name]
		return article ? article.sizes.map(size => ({ value: size, label: size })) : []
	}

	return (
		<>
			<table className="table" style={{ width: '100%', marginTop: '16px' }}>
				<thead>
					<tr>
						<th>类型</th>
						<th>名称</th>
						<th>规格</th>
						<th>定价层级</th>
						<th>单价</th>
						<th>计算类型</th>
						<th>备注</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{fields.map((entry, index) => (
						<tr key={index}>
							<td>
								<Field name={`${entry}.type`} component={Select} style={{ minWidth: '6em' }}>
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
									style={{ minWidth: '7em' }}
								/>
							</td>
							<td>
								<Field
									name={`${entry}.size`}
									component={FilterSelect}
									options={getSizeOptions(fields.get(index).name)}
									validate={validator.required}
									placeholder="规格"
									style={{ minWidth: '11em' }}
								/>
							</td>
							<td>
								<Field name={`${entry}.level`} component={Select} style={{ minWidth: '10em' }}>
									<option value="产品">定价到产品</option>
									<option value="规格">定价到规格</option>
								</Field>
							</td>
							<td>
								<Field name={`${entry}.unitRepair`} component={Input} validate={[validator.required, validator.num]} />
							</td>
							<td>
								<Field name={`${entry}.type`} component={Select}>
									<option value="数量">根据数量计算</option>
									<option value="换算数量">根据换算后数量计算</option>
									<option value="重量">根据理论重量计算</option>
								</Field>
							</td>
							<td>
								<Field name={`${entry}.comments`} component={Input} />
							</td>
							<td>
								<Button type="primary" danger size="small" onClick={() => fields.remove(index)}>
									删除
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Button style={{ marginTop: '8px' }} onClick={add} type="dashed" block>
				<PlusOutlined />
				增加
			</Button>
		</>
	)
})

export default RepairEntry
