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
import { Link } from 'react-router'

import { currencyFormat, dateFormat, percentFormat } from '../utils'
import { projectDeleteItem } from '../actions'
import RentCalcTable from './RentCalcTable'

const styles = {
  title: {
    fontSize: 42,
  },
  content: {
    marginTop: '2em',
    padding: '1em',
  }
}

class ContractItem extends React.Component {

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
    // TODO 处理空异常
    const item = project.items.filter(item => item._id === params.itemId)[0]
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
              <Button key={3} component={Link} to={`contract/${params.id}/item/${params.itemId}/preview`}>打印预览</Button>,
            ]
          }
          title={`${project.company} ${project.name} 对账单`}
          subheader={`${dateFormat(item.startDate)} ~ ${dateFormat(item.endDate)}`}
        />
        <CardContent>
          <Typography variant="subheading" color="textSecondary">
          </Typography>
          <p>租金：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(761946.14) }</span> </p>
          <p>税率：<span style={{ fontSize: 'xx-large' }}>{ percentFormat(0.03) }</span> </p>
          <p>维修费：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(150000.00) }</span> </p>
          <p>赔偿费：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(232.23) }</span> </p>
          <p>运杂费：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(232.23) }</span> </p>
        </CardContent>
        <RentCalcTable
          rent={item.content}
        />
      </Card>,
    ]
  }
}

ContractItem.propTypes = {
  classes: PropTypes.object.isRequired,
}


const mapStateToProps = state => {
  return {
    projects: state.system.projects,
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ContractItem))