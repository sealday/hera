import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'

import { total_, isUpdatable } from '../utils'

const styles = theme => ({
  flex: {
    flex: 1,
  },
  marginTop: {
    marginTop: '2em',
  }
})

class TransferOrder extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  handleTransport = () => {
    const { router, record } = this.props
    router.push(`/transport/${record._id}`)
  }

  state = {
    rowsPerPage: {
      l: 5,
      s: 5,
      c: 5,
      r: 5,
    },
    page: {
      l: 0,
      s: 0,
      c: 0,
      r: 0,
    },
  }

  render() {
    const { record, store, projects, articles, router, user } = this.props
    let direction = null

    if (record.inStock === store._id) {
      direction = 'in'
    } else if (record.outStock === store._id) {
      direction = 'out'
    }

    let entries = {}
    let total = {}
    record.entries.forEach(entry => {
      let result = total_(entry, this.props.products)

      if (entry.name in entries) {
        total[entry.name] += result
        entries[entry.name].push(entry)
      } else {
        entries[entry.name] = [entry]
        total[entry.name] = result
      }
    })

    let productTypeMap = {}
    articles.forEach(article => {
      productTypeMap[article.name] = article
    })

    const inProject = projects.get(record.inStock)
    const outProject = projects.get(record.outStock)
    const { classes } = this.props

    const records = {
      l: record.entries.filter(entry => entry.mode === 'L'),
      s: record.entries.filter(entry => entry.mode === 'S'),
      c: record.entries.filter(entry => entry.mode === 'C'),
      r: record.entries.filter(entry => entry.mode === 'R'),
    }

    const names = {
      l: '租赁',
      s: '销售',
      c: '赔偿',
      r: '服务',
    }

    return (
      <div>
        <Card>
          <CardHeader
            action={
              <div>
                <Button onClick={() => router.goBack()}>返回</Button>
                <Button onClick={this.handleTransport}>运输单</Button>
                {direction && <Button component={Link} to={`/record/${record._id}/preview`}>打印预览</Button>}
                {isUpdatable(store, user) && direction &&
                <Button variant="raised" component={Link} to={`/transfer/${direction}/${record._id}/edit`} color="primary">编辑</Button>
                }
              </div>
            }
          />
          <CardContent>
            <Typography variant="display3">调拨单</Typography>
            <Typography variant="subheading">单号：{record.number} 日期：{moment(record.outDate).format('YYYY-MM-DD')}</Typography>
            <Divider className={classes.marginTop}/>
            <Typography variant="body1" className={classes.marginTop}>出库：{outProject.company}{outProject.name}</Typography>
            <Typography variant="body1">入库：{inProject.company}{inProject.name}</Typography>
            <Typography variant="body1">制单人：{record.username}</Typography>
          </CardContent>
        </Card>

        <Card className={classes.marginTop}>
          <CardContent>
            <Typography variant="headline">流程进度</Typography>
            <Stepper>
              <Step>
                <StepLabel>aaa</StepLabel>
              </Step>
              <Step>
                <StepLabel>bbb</StepLabel>
              </Step>
              <Step>
                <StepLabel>ccc</StepLabel>
              </Step>
            </Stepper>
          </CardContent>
        </Card>

        {['l', 's', 'c', 'r'].map(t => (
           records[t].length > 0 && <Card className={classes.marginTop} key={t}>
            <CardContent>
              <Typography variant="headline">{names[t]}</Typography>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>产品</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell numeric>数量</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records[t]
                    .slice(this.state.rowsPerPage[t] * this.state.page[t], this.state.rowsPerPage[t] * (this.state.page[t] + 1))
                    .map(entry => (
                      <TableRow key={entry._id}>
                        <TableCell>{entry.name}</TableCell>
                        <TableCell>{entry.size}</TableCell>
                        <TableCell numeric>{entry.count}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                labelRowsPerPage="每页"
                count={records[t].length}
                rowsPerPage={this.state.rowsPerPage[t]}
                page={this.state.page[t]}
                onChangePage={(e, page) => this.setState(prev => ({ page: { ...prev.page, [t]: page } }))}
                onChangeRowsPerPage={e => this.setState(prev => ({ rowsPerPage: { ...prev.rowsPerPage, [t]: e.target.value } }))}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.system.projects,
  articles: state.system.articles.toArray(),
  products: state.system.products,
  store: state.system.store,
  user: state.system.user,
})

export default connect(mapStateToProps)(withStyles(styles)(TransferOrder))