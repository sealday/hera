import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core'
import {
  Popconfirm,
} from 'antd'
import 'antd/lib/popconfirm/style/css'

import { ajax } from '../../utils'
import { newErrorNotify, newInfoNotify, newSuccessNotify, queryCompensationPlan, COMPENSATION_PLAN } from '../../actions'

class Compensation extends React.Component {
  componentDidMount() {
    this.load()
  }

  load = () => {
    this.props.dispatch(queryCompensationPlan())
  }

  handleDelete = (id) => {
    this.props.dispatch(newInfoNotify('提示', '正在删除', 1000))
    ajax(`/api/compensation/${ id }/delete`, {
      method: 'POST',
      contentType: 'application/json'
    }).then((res) => {
      this.props.dispatch(newSuccessNotify('提示', '删除成功', 1000))
      this.load()
    }).catch((err) => {
      this.props.dispatch(newErrorNotify('警告', '删除失败', 1000))
    })
  }

  render() {
    return (
      <Card>
        <CardHeader
          title="维修方案"
          action={<>
            <Button color="primary" component={Link} to="/compensation/create">新增</Button>
          </>}
        />
        <CardContent>
          <table className="table table-bordered" style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
            <tr>
              <th>名称</th>
              <th>日期</th>
              <th>备注</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {(this.props.plans || []).map((plan) => (
              <tr key={plan._id}>
                <td>{plan.name}</td>
                <td>{moment(plan.date).format('YYYY-MM-DD')}</td>
                <td>{plan.comments}</td>
                <td>
                  <Link component="button" to={`/compensation/${plan._id}`}>编辑</Link>
                  <Popconfirm
                    title={`确认删除“${plan.name}”方案吗？`}
                    onConfirm={() => this.handleDelete(plan._id)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Link>删除</Link>
                  </Popconfirm>
                  <Link to={`/compensation/create/${plan._id}`}>克隆</Link>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {
  const plans = state.results.get(COMPENSATION_PLAN, [])
  return {
    plans: plans,
  }
}
export default connect(mapStateToProps)(Compensation)
