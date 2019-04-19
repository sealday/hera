import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import { ajax } from '../utils'
import { connect } from 'react-redux'
import { newErrorNotify, newInfoNotify, newSuccessNotify, queryPricePlan, PRICE_PLAN } from '../actions'

class Price extends React.Component {
  componentDidMount() {
    this.load()
  }

  load = () => {
    this.props.dispatch(queryPricePlan())
  }

  handleDelete = (id) => {
    this.props.dispatch(newInfoNotify('提示', '正在删除', 1000))
    ajax(`/api/price/${ id }/delete`, {
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
      <div>
        <h2 className="page-header">价格方案</h2>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <ul className="nav navbar-nav navbar-right ">
              <li><Link to="/price/create">点击这里创建一个空白的价格方案</Link></li>
            </ul>
          </div>
        </nav>
        <table className="table">
          <thead>
          <tr>
            <th>名称</th>
            <th>日期</th>
            <th>备注</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {this.props.plans.map((plan) => (
            <tr key={plan._id}>
              <td>{plan.name}</td>
              <td>{moment(plan.date).format('YYYY-MM-DD')}</td>
              <td>{plan.comments}</td>
              <td>
                <Link className="btn btn-default" to={`/price/${plan._id}`}>编辑</Link>
                <button className="btn btn-danger h-left-margin-1-em" onClick={() => this.handleDelete(plan._id)}>删除</button>
                <Link className="btn btn-primary h-left-margin-1-em" to={`/price/create/${plan._id}`}>创建</Link>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const plans = state.results.get(PRICE_PLAN, [])

  return {
    plans: plans,
  }
}
export default connect(mapStateToProps)(Price)
