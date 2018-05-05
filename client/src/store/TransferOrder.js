/**
 * Created by seal on 15/01/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { toFixedWithoutTrailingZero as fixed, total_, isUpdatable, getUnit } from '../utils'
import { Link } from 'react-router'
import Card, { CardHeader, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import Button from 'material-ui/Button'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

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
    classes: React.PropTypes.object.isRequired,
  }

  handleTransport = () => {
    const { router, record } = this.props
    router.push(`/transport/${record._id}`)
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

    let printEntries = []
    for (let name in entries) {
      /*eslint guard-for-in: off*/
      printEntries = printEntries.concat(entries[name].map(entry => [
        entry.name,
        entry.size,
        entry.count + ' ' + productTypeMap[name].countUnit,
        entry.comments,
      ]))
      printEntries.push(
        [
          name,
          '小计',
          fixed(total[name])  + ' ' + getUnit(productTypeMap[name]),
          '',
        ]
      )
    }

    // TODO 这里不应该会出现 fee，如果出现就是错误的了
    if (record.type === '调拨') {
      if (!record.fee) {
        console.warn('调拨单费用不应该是null')
      }
      record.fee = record.fee || {}
      printEntries.push(
        [
          '运费：',
          `￥${record.fee.car || 0} `,
          '整理费：',
          `￥${record.fee.sort || 0}`,
        ]
      );
      printEntries.push(
        [
          '其他费用1：',
          `￥${record.fee.other1 || 0}`,
          `其他费用2：`,
          `￥${record.fee.other2 || 0}`,
        ]
      );
    }

    if (printEntries.length % 2 !== 0) {
      printEntries.push(['', '', '', ''])
    }

    let rows = []
    const half = printEntries.length / 2
    for (let i = 0; i < half; i++) {
      rows.push(printEntries[i].concat(printEntries[i + half]))
    }

    const inProject = projects.get(record.inStock)
    const outProject = projects.get(record.outStock)
    const { classes } = this.props

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
                <Button component={Link} to={`/transfer/${direction}/${record._id}/edit`} color="primary">编辑</Button>
                }
              </div>
            }
          />
          <CardContent>
            <Typography variant="display3">调拨单</Typography>
            <Typography variant="subheadline">单号：{record.number} 日期：{moment(record.outDate).format('YYYY-MM-DD')}</Typography>
            <Divider className={classes.marginTop}/>
            <Typography variant="paragraph" className={classes.marginTop}>出库：{outProject.company}{outProject.name}</Typography>
            <Typography variant="paragraph">入库：{inProject.company}{inProject.name}</Typography>
            <Typography variant="paragraph">制单人：{record.username}</Typography>
          </CardContent>
        </Card>

        <Card className={classes.marginTop}>
          <CardContent>
            <Typography variant="display3">租赁</Typography>
            {record.entries.map(entry => (<p>
              {entry.name} {entry.size} {entry.count}
            </p>))}
          </CardContent>
        </Card>

        <Card className={classes.marginTop}>
          <CardContent>
            <Typography variant="display3">销售</Typography>

          </CardContent>
        </Card>

        <Card className={classes.marginTop}>
          <CardContent>
            <Typography variant="display3">赔偿</Typography>

          </CardContent>
        </Card>

        <Card className={classes.marginTop}>
          <CardContent>
            <Typography variant="display3">维修</Typography>

          </CardContent>
        </Card>
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