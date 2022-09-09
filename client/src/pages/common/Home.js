import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import axios from 'axios'

import { queryLatestOperations, queryMoreOperations } from '../../actions'
import { getLevelName, isCurrentUserPermit } from '../../utils'
import { PageHeader } from '../../components'
import { Button, Card, Col, Row, Statistic, Table, Typography } from 'antd'

const styles = {
  diffAdd: {
    backgroundColor: '#97f295',
    padding: '2px',
  },
  diffRemove: {
    backgroundColor: '#ffb6ba',
    padding: '2px',
  },
  button: {
    margin: '0 8px 0 8px',
  },
  row: {
    width: '100%',
  }
}
export default () => {

  const { system, operations } = useSelector(state => ({
    system: state.system,
    operations: state.results.get('operations', []),
  }))
  const dispatch = useDispatch()
  const [state, setState] = useState({
    newInRecords: '加载中...',
    newOutRecords: '加载中...',
    updateRecords: '加载中...',
  })
  const doRequest = async type => axios.get(`/api/status/${type}`, {
    params: { store: system.store._id }
  })
  useEffect(() => {
    dispatch(queryLatestOperations())
    axios.all([
      'new_in_records',
      'new_out_records',
      'update_records'].map(type => doRequest(type)))
      .then(res => {
        const [newInRecords, newOutRecords, updateRecords] = res.map(res => res.data.data.num)
        setState({
          newInRecords, newOutRecords, updateRecords
        })
      })

  }, [])

  const renderReport = report => {
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
    items.push(<p key="number">单号：{report.number}</p>)
    let entries = report.recordEdit || []
    entries.forEach((diff) => {
      items.push(<p key={diff.field}>
        <span>{nameMap[diff.field]}：</span>
        {diff.old && <span style={styles.diffRemove}>{JSON.stringify(diff.old)}</span>}
        {diff.new && <span style={styles.diffAdd}>{JSON.stringify(diff.new)}</span>}
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

  const columns = [
    { key: 'level', title: '日志等级', dataIndex: 'level', render: getLevelName },
    { key: 'timestamp', title: '操作时间', dataIndex: 'timestamp', render: t => moment(t).format('MMMM Do YYYY, h:mm:ss a') },
    { key: 'type', title: '操作类型', dataIndex: 'type', render: t => t ? t : '修改' },
    { key: 'user.username', title: '操作人', dataIndex: ['user', 'username'] },
    { key: 'content', title: '修改内容', render: (_t, op) => op.report.message ? op.report.message : renderReport(op.report) },
  ]
  return (
    <PageHeader
      title='仪表盘'
    >
      <Row gutter={[8, 8]} style={styles.row}>
        <Col span={24}>
          <Card>
            <Typography.Paragraph>亲爱的，欢迎使用{system.config.systemName}，祝您心情愉快，工作顺利！</Typography.Paragraph>
          </Card>
        </Col>
        {isCurrentUserPermit(system.user, ['系统管理员', '基地仓库管理员']) && (
          <>
            <Col span={8}>
              <Card>
                <Statistic title='入库单新增量' value={state.newInRecords} suffix='单' />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title='出库单新增量' value={state.newOutRecords} suffix='单' />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title='出入库修改量' value={state.updateRecords} suffix='单' />
              </Card>
            </Col>
          </>
        )}
        <Col span={24}>
          <Card
            title='日志'
            extra={[<Button key='refresh' type='primary' onClick={() => dispatch(queryLatestOperations())}>刷新</Button>]}
            actions={[<Button key='more' type='primary' block
              onClick={() => {
                const ops = operations
                if (ops.length > 0) {
                  dispatch(queryMoreOperations(ops[ops.length - 1]._id))
                }
              }}
            >加载更多</Button>]}
          >
            <Table columns={columns} dataSource={operations} rowKey='_id' pagination={false} />
          </Card>
        </Col>
      </Row>
    </PageHeader>
  )
}