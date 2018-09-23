import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import short_id from 'shortid'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fade from '@material-ui/core/Fade'

import { currencyFormat, dateFormat } from '../utils'
import { projectDeleteItem } from '../actions'

const styles = {
  title: {
    fontSize: 42,
  },
  content: {
    marginTop: '2em',
    padding: '1em',
  }
}

class ContractContent extends React.Component {

  state = {
    open: false,
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  componentDidMount() {
    let { projects, params } = this.props
    console.log(projects.get(params.id))
  }

  render() {
    let { projects, params, classes, router, dispatch } = this.props

    const project = projects.get(params.id)
    return [
      <Dialog
        key={0}
        open={this.state.open}
        TransitionComponent={Fade}
        keepMounted
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>,
      <Card key={1}>
        <CardHeader
          action={
            [
              <Button key={0} onClick={() => router.goBack()}>返回</Button>,
              <Button key={1} onClick={this.handleClickOpen} color="primary">编辑</Button>,
              <Button key={2} onClick={() => router.push('rent_calc')} color="primary">创建对账单</Button>,
            ]
          }
          title={`${project.company} ${project.name}`}
          subheader={`内部编号：${project._id} 外部编号：${short_id.generate()}`}
        />
        <CardContent>
          <Typography variant="subheading" color="textSecondary">
          </Typography>
          <p>费用：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(761946.14) }</span> </p>
          <p>收款：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(150000.00) }</span> </p>
          <p>税收：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(232.23) }</span> </p>
        </CardContent>
      </Card>,
      <Paper className={classes.content} key={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell>日期区间</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>更新时间</TableCell>
              <TableCell>操作员</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {project.items.map(item => (
              <TableRow key={item._id} id={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{dateFormat(item.startDate)} ~ {dateFormat(item.endDate)}</TableCell>
                <TableCell>{dateFormat(item.createdAt)}</TableCell>
                <TableCell>{dateFormat(item.updatedAt)}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>
                  <Button>查看</Button>
                  <Button color="secondary" onClick={() => dispatch(projectDeleteItem({ project: project._id, item: item._id }))}>删除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>,
    ]
  }
}

ContractContent.propTypes = {
  classes: PropTypes.object.isRequired,
}

ContractContent = withStyles(styles)(ContractContent)

const mapStateToProps = state => {
  return {
    projects: state.system.projects,
  }
}

export default connect(mapStateToProps)(ContractContent)