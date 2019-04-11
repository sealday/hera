import React from 'react'
import { connect } from 'react-redux'
import short_id from 'shortid'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'

import { currencyFormat, dateFormat } from '../utils'
import { projectDeleteItem } from '../actions'

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

  total(project) {
    return project.items.map(item => item.content.group[0].price).reduce((a, b) => a + b, 0)
  }

  render() {
    let { projects, params, router, dispatch } = this.props

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
              <Button key={2} onClick={() => router.push('rent_calc')} color="primary">创建对账单</Button>,
            ]
          }
          title={`${project.company} ${project.name}`}
          subheader={`内部编号：${project._id} 外部编号：${short_id.generate()}`}
        />
        <CardContent>
          <Typography variant="subheading" color="textSecondary">
          </Typography>
          <p>费用：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(this.total(project)) }</span> </p>
          <p>收款：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(0) }</span> </p>
          <p>税款：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(0) }</span> </p>
        </CardContent>
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
                  <Button
                    onClick={() => {
                      router.push(`contract/${project._id}/item/${item._id}`)
                    }}>查看</Button>
                  <Button
                    color="secondary"
                    onClick={() => dispatch(projectDeleteItem({ project: project._id, item: item._id }))}>删除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>,
    ]
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects,
})

export default connect(mapStateToProps)(ContractContent)