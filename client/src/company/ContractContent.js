import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { currencyFormat, dateFormat } from '../utils'
import Typography from '@material-ui/core/Typography'
import short_id from 'shortid'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  title: {
    fontSize: 42,
  },
};

class ContractContent extends React.Component {

  componentDidMount() {
    let { projects, params } = this.props
    console.log(projects.get(params.id))
  }

  render() {
    let { projects, params, classes } = this.props

    const project = projects.get(params.id)
    return (
      <div>
        <h2 className="page-header">合同详情</h2>
        <Card>
          <CardContent>
            <Typography
              className={classes.title}
              variant="headline"
              component="h2"
            >{ project.company } { project.name }</Typography>
            <Typography variant="subheading" color="textSecondary">
              <p>编号：{ project._id }  <br/>外部：{ short_id.generate() }</p>
            </Typography>
            <p>费用：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(761946.14) }</span> </p>
            <p>收款：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(150000.00) }</span> </p>
            <p>税收：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(232.23) }</span> </p>
          </CardContent>
        </Card>
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
          {project.items.map(item => (
            <tr key={item._id} id={item._id}>
              <td>{item.name}</td>
              <td>{dateFormat(item.startDate)} ~ {dateFormat(item.endDate)}</td>
              <td>{dateFormat(item.createdAt)}</td>
              <td>{dateFormat(item.updatedAt)}</td>
              <td>{item.username}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}

ContractContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

ContractContent = withStyles(styles)(ContractContent)

const mapStateToProps = state => {
  return {
    projects: state.system.projects,
  }
}

export default connect(mapStateToProps)(ContractContent);