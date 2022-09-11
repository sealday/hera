import React, { useEffect } from 'react'

import moment from 'moment'
import { Button, Card, Tag, Descriptions } from 'antd'
import { connect } from 'react-redux'
import { CONTRACT_DETAILS, queryContractDetails } from '../../../actions'
import { rentExcelExport } from '../../../utils'
import RentCalcTable from '../RentCalcTable'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../../components'

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

export default connect(mapStateToProps)(({ dispatch, contract }) => {
  const { id, calcId } = useParams()
  useEffect(() => {
    dispatch(queryContractDetails(id))
  }, [dispatch, id])

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

  const descriptions = [
    { label: '项目部', children: <ProjectLabel projectId={contract.project} /> },
    { label: '状态', children: <Tag color="green">{contract.status}</Tag> },
    { label: "签约时间", children: moment(contract.date).format('YYYY-MM-DD') },
    { label: "结算名称", children: currentCalc.name },
    { label: "结算开始日期", children: moment(currentCalc.start).format('YYYY-MM-DD') },
    { label: "结算结束日期", children: moment(currentCalc.end).format('YYYY-MM-DD') },
    { label: "备注", children: contract.comments },
  ]

  return (
    <PageHeader
      title={`${contract.name}结算表`}
      subTitle={contract.code}
      descriptions={descriptions}
      extra={[
        <Button type='primary' key={2} onClick={() => {
          import('xlsx').then(XLSX => {
            rentExcelExport(XLSX, currentCalc)
          }).catch(() => {
            alert('加载 Excel 控件失败，请重试')
          })
        }}>导出 EXCEL</Button>,
      ]}
    >
      <Card>
        {currentCalc && <RentCalcTable rent={currentCalc} />}
      </Card>
    </PageHeader>
  )
})