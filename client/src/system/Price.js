import React from 'react'
import shortId from 'shortid'
import moment from 'moment'

class Price extends React.Component {
  state = {
    plans: [{
      _id: shortId.generate(),
      name: '基本方案',
      date: moment('2018-01-01'),
      comments: '这是一个基础方案'
    }]
  }
  render() {
    return (
      <div>
        <h2 className="page-header">定价方案</h2>
        <table className="table">
          <thead>
          <tr>
            <th>编号</th>
            <th>名称</th>
            <th>日期</th>
            <th>备注</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {this.state.plans.map((plan) => (
            <tr key={plan._id}>
              <td>{plan._id}</td>
              <td>{plan.name}</td>
              <td>{moment(plan.date).format('YYYY-MM-DD')}</td>
              <td>{plan.comments}</td>
              <td>
                <button className="btn btn-default">编辑</button>
                <button className="btn btn-default">从这个创建</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Price