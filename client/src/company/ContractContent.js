import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { removeProject } from '../actions'
import moment from 'moment'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { currencyFormat, dateFormat } from '../utils'
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import short_id from 'shortid'


class ContractContent extends React.Component {

  componentDidMount() {
    let { projects, params } = this.props
    console.log(projects.get(params.id))
  }

  render() {
    let { projects, params } = this.props
    const project = projects.get(params.id)
    const contents = [
      {
        _id: 0,
        name: '对账单',
        startDate: moment('2018-01-21'),
        endDate: moment('2018-02-20'),
        createdAt: moment('2018-02-25'),
        updatedAt: moment('2018-02-25'),
        username: '管理员',
      },
      {
        _id: 1,
        name: '对账单',
        startDate: moment('2018-02-21'),
        endDate: moment('2018-03-20'),
        createdAt: moment('2018-03-25'),
        updatedAt: moment('2018-03-25'),
        username: '管理员',
      },
    ]
    return (
      <div>
        <h2 className="page-header">合同详情</h2>
        <MuiThemeProvider>
            <Card>
              <CardTitle
                title={`${ project.company } ${ project.name }`}
                subtitle={<p>编号：{ project._id }  <br/>外部：{ short_id.generate() }</p>}  />
              <CardText>
                <p>费用：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(761946.14) }</span> </p>
                <p>收款：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(150000.00) }</span> </p>
                <p>税收：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(232.23) }</span> </p>
              </CardText>
              <CardActions>
                <FlatButton label="添加新的对账单" onClick={() => {} } />
              </CardActions>
            </Card>
        </MuiThemeProvider>
        <table className="table table-bordered" style={{ marginTop: '2em' }}>
          <thead>
          <tr>
            <th>名称</th>
            <th>日期区间</th>
            <th>创建时间</th>
            <th>更新时间</th>
            <th>操作员</th>
          </tr>
          </thead>
          <tbody>
          {contents.map(content => (
            <tr key={content._id} id={content._id}>
              <td>{content.name}</td>
              <td>{dateFormat(content.startDate)} - {dateFormat(content.endDate)}</td>
              <td>{dateFormat(content.createdAt)}</td>
              <td>{dateFormat(content.updatedAt)}</td>
              <td>{content.username}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.system.projects,
  }
}

export default connect(mapStateToProps)(ContractContent);