import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router'

import { currencyFormat, dateFormat, percentFormat } from '../utils'
import RentCalcTable from './RentCalcTable'
import ContractFormDialog from './ContractFormDialog'

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

  handleEditSave = (values) => {
    let { projects, params } = this.props
    const project = projects.get(params.id)
    const item = project.items.filter(item => item._id === params.itemId)[0]
    item.taxRate = values.taxRate
    this.handleClose()
  }

  componentDidMount() {
    let { projects, params } = this.props
    console.log(projects.get(params.id))
  }

  render() {
    let { projects, params, router } = this.props

    const project = projects.get(params.id)
    // TODO 处理空异常
    const item = project.items.filter(item => item._id === params.itemId)[0]
    return <>
      <ContractFormDialog
        initialValues={{
          taxRate: item.taxRate,
        }}
        open={this.state.open}
        onSubmit={this.handleEditSave}
        onClose={this.handleClose}/>,
      <Card>
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
          <p>租金：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(item.content.group[0].price) }</span> </p>
          <p>税率：<span style={{ fontSize: 'xx-large' }}>{ percentFormat(item.taxRate) }</span> </p>
          <p>维修费：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(0) }</span> </p>
          <p>赔偿费：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(0) }</span> </p>
          <p>运杂费：<span style={{ fontSize: 'xx-large' }}>{ currencyFormat(item.content.group[0].freight) }</span> </p>
        </CardContent>
        <RentCalcTable
          rent={item.content}
        />
      </Card>
    </>
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

export default connect(mapStateToProps)(
  withStyles(styles)(
    ContractItem
  )
)