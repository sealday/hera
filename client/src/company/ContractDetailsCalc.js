import React, { useEffect, useState } from 'react'

import moment from 'moment'
import { Popconfirm, Button, Card, PageHeader, Table, Space, Tag, Row, Col, Descriptions, Modal, Form, Input, Select, DatePicker } from 'antd'
import { Link } from 'react-router'
import 'antd/lib/card/style/css'
import 'antd/lib/page-header/style/css'
import 'antd/lib/table/style/css'
import 'antd/lib/space/style/css'
import 'antd/lib/tag/style/css'
import 'antd/lib/row/style/css'
import 'antd/lib/col/style/css'
import 'antd/lib/descriptions/style/css'
import 'antd/lib/modal/style/css'
import { connect } from 'react-redux'
import { ALL_PLAN, CONTRACT_DETAILS, newErrorNotify, newInfoNotify, newSuccessNotify, queryContractDetails, queryAllPlans } from '../actions'
import { ajax } from '../utils'
import RentCalcTable from './RentCalcTable'

const mapStateToProps = (state) => {
  const contract = state.results.get(CONTRACT_DETAILS, {})
  return {
    contract: contract,
  }
}

const ProjectLabel = connect(state => ({
  projects: state.system.projects,
}))(({ projects, projectId }) => {
  if (projects && projects.get(projectId)) {
    return <>{projects.get(projectId).completeName}</>
  }
  return <>projectId</>
})

export default connect(mapStateToProps)(({ router, dispatch, contract, params: { id, calcId } }) => {
  useEffect(() => {
    dispatch(queryContractDetails(id))
  }, [id])

  let currentCalc = null
  if (contract && contract.calcs) {
    for (let calc of contract.calcs) {
      if (calc._id === calcId) {
        currentCalc = calc
      }
    }
  }

  if (!currentCalc) {
    return <></>
  }

  return <Space direction="vertical">
    <PageHeader
      ghost={false}
      title={`${contract.name}结算表`}
      subTitle={contract.code}
      extra={[
        <Button key={1} onClick={() => router.goBack()}>返回</Button>,
      ]}
    >
      <Descriptions size="small" column={3}>
        <Descriptions.Item label="项目部"><ProjectLabel projectId={contract.project} /></Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color="green">{contract.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="签约时间">{moment(contract.date).format('YYYY-MM-DD')}</Descriptions.Item>
        <Descriptions.Item label="结算名称">{currentCalc.name}</Descriptions.Item>
        <Descriptions.Item label="结算开始日期">{moment(currentCalc.start).format('YYYY-MM-HH')}</Descriptions.Item>
        <Descriptions.Item label="结算结束日期">{moment(currentCalc.end).format('YYYY-MM-DD')}</Descriptions.Item>

        <Descriptions.Item label="备注">
          {contract.comments}
        </Descriptions.Item>
      </Descriptions>
    </PageHeader>
    <Card>
      {currentCalc && <RentCalcTable rent={currentCalc} />}
    </Card>
  </Space>
})