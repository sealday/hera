import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'

import { queryLatestOperations, queryMoreOperations } from './actions'

const styles = {
  diffAdd: {
    backgroundColor: '#97f295',
    padding: '2px',
  },
  diffRemove: {
    backgroundColor: '#ffb6ba',
    padding: '2px',
  }
}

class Home extends Component {
  state = {
    newInRecords: '加载中...',
    newOutRecords: '加载中...',
    updateRecords: '加载中...',
  }
  componentDidMount() {
    const { system } = this.props
    this.props.dispatch(queryLatestOperations())
    fetch(`/api/status/new_in_records?store=${system.store._id}`)
      .then(r => r.json())
      .then(res => {
        this.setState({
          newInRecords: res.data.num,
        })
      })
    fetch(`/api/status/new_out_records?store=${system.store._id}`)
      .then(r => r.json())
      .then(res => {
        this.setState({
          newOutRecords: res.data.num,
        })
      })
    fetch(`/api/status/update_records?store=${system.store._id}`)
      .then(r => r.json())
      .then(res => {
        this.setState({
          updateRecords: res.data.num,
        })
      })
  }
  renderReport(report) {
    const items = []
    const nameMap = {
      outStock: '出库',
      inStock: '入库',
      vendor: '第三方',
      originalOrder: '原始单号',
      carNumber: '车号',
      carFee: '运费',
      sortFee: '整理费用',
      other1Fee: '其他费用1',
      other2Fee: '其他费用2',
      comments: '备注',
    }
    let entries = report.recordEdit || []
    entries.forEach((diff) => {
      items.push(<p key={diff.field}>
        <span>{nameMap[diff.field]}：</span>
        { diff.old && <span style={styles.diffRemove}>{JSON.stringify(diff.old)}</span> }
        { diff.new && <span style={styles.diffAdd}>{JSON.stringify(diff.new)}</span> }
      </p>)
    })
    entries = report.entryAdd || []
    entries.forEach((entry) => {
      items.push(<p key={entry.field}
      ><span style={styles.diffAdd}>{entry.new.name} | {entry.new.size} | {entry.new.count}</span></p>)
    })
    entries = report.entryRemove || []
    entries.forEach((entry) => {
      items.push(<p key={entry.field}
      ><span style={styles.diffRemove}>{entry.old.name} | {entry.old.size} | {entry.old.count}</span></p>)
    })
    entries = report.entryEdit || []
    entries.forEach((entry) => {
      items.push(<p key={entry.field}>
        <span style={styles.diffRemove}>{entry.old.name} | {entry.old.size} | {entry.old.count}</span>
        <i className="glyphicon glyphicon-triangle-right" />
        <span style={styles.diffAdd}>{entry.new.name} | {entry.new.size} | {entry.new.count}</span>
      </p>)
    })

    return items
  }
  render() {
    if (this.props.system.user.role  !== '系统管理员') {
      return null
    }
    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="赫拉管理系统"/>
            <CardContent>
              <Typography>亲爱的，欢迎使用赫拉管理系统，祝您心情愉快，工作顺利！</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography>入库单新增量</Typography>
              <Typography>{this.state.newInRecords}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography>出库单新增量</Typography>
              <Typography>{this.state.newOutRecords}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography>出入库修改量</Typography>
              <Typography>{this.state.updateRecords}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="日志"
              action={
                <Button color="primary" onClick={() => {
                  this.props.dispatch(queryLatestOperations())
                }}>刷新</Button>
              }
            />
            <Table className="Table Table-bordered">
              <TableHead>
                <TableRow>
                  <TableCell>操作时间</TableCell>
                  <TableCell>操作类型</TableCell>
                  <TableCell>操作人</TableCell>
                  <TableCell>修改内容</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.operations.map((op) => (
                  <TableRow key={op._id}>
                    <TableCell>{moment(op.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                    <TableCell>{op.type || '修改'}</TableCell>
                    <TableCell>{op.user.username}</TableCell>
                    <TableCell>
                      <p key="number">单号：{op.report.number}</p>
                      {this.renderReport(op.report)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <CardContent>
              <Button
                onClick={() => {
                  const ops = this.props.operations
                  if (ops.length > 0) {
                    this.props.dispatch(queryMoreOperations(ops[ops.length - 1]._id))
                  }
                }}
              >加载更多</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  system: state.system,
  operations: state.results.get('operations', []),
})

export default connect(mapStateToProps)(Home)
