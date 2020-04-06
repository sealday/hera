import React from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {CardHeader} from '@material-ui/core'
import {Card, Table, Popconfirm, Button} from 'antd'
import {PlusOutlined, SnippetsOutlined, DeleteOutlined, CopyOutlined} from '@ant-design/icons'

import {ajax} from '../../utils'
import {newErrorNotify, newInfoNotify, newSuccessNotify, queryRepairPlan, COMPENSATION_PLAN} from '../../actions'

class Repair extends React.Component {
	componentDidMount() {
		this.load()
	}

	load = () => {
		this.props.dispatch(queryRepairPlan())
	}

	handleDelete = (id) => {
		this.props.dispatch(newInfoNotify('提示', '正在删除', 1000))
		ajax(`/api/repair/${id}/delete`, {
			method: 'POST',
			contentType: 'application/json',
		})
			.then((res) => {
				this.props.dispatch(newSuccessNotify('提示', '删除成功', 1000))
				this.load()
			})
			.catch((err) => {
				this.props.dispatch(newErrorNotify('警告', '删除失败', 1000))
			})
	}

	columns = [
		{
			key: 'name',
			dataIndex: 'name',
			title: '名称',
		},
		{
			key: 'date',
			dataIndex: 'date',
			title: '日期',
		},
		{
			key: 'comments',
			dataIndex: 'comments',
			title: '备注',
		},
		{
			key: 'copy',
			render: (_, { _id, name }) => (
				<Button type="dashed" danger>
					<CopyOutlined />
					<Link to={`/repair/create/${_id}`} style={{ color: 'black' }}>
						复制
					</Link>
				</Button>
			),
		},
		{
			key: 'delete',
			render: (_, { _id, name }) => (
				<Popconfirm title={`确认删除“${name}”方案吗？`} onConfirm={() => this.handleDelete(_id)} okText="确认" cancelText="取消">
					<Button type="primary" danger>
						<DeleteOutlined />
						<Link to={`/repair/${_id}`} style={{ color: 'white' }}>
							删除
						</Link>
					</Button>
				</Popconfirm>
			),
		},
		{
			key: 'edit',
			title: (
				<Button type="primary">
					<PlusOutlined />
					<Link to="/repair/create" style={{ color: 'white' }}>
						新增
					</Link>
				</Button>
			),
			render: (_, { _id }) => (
				<Button type="primary">
					<SnippetsOutlined />
					<Link to={`/repair/${_id}`} style={{ color: 'white' }}>
						编辑
					</Link>
				</Button>
			),
		},
	]

	data = [
		{
			key: '12',
			name: '测试维修方案',
			date: '20200311',
			comments: '这里是备注信息',
		},
		{
			key: '121',
			name: '测试维修方案',
			date: '20200311',
			comments: '这里是备注信息',
		},
	]

	render() {
		return (
			<>
				<Card>
					<CardHeader title="维修方案" />
				</Card>
				<Card>
					<Table columns={this.columns} dataSource={this.props.plans} />
				</Card>
			</>
		)
	}
}

const mapStateToProps = state => {
	const plans = state.results.get(COMPENSATION_PLAN, [])
	return {plans}
}
export default connect(mapStateToProps)(Repair)
