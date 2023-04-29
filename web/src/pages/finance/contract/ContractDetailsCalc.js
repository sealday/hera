import React, { useEffect } from 'react'

import moment from 'moment'
import { Button, Card, Tag, Descriptions } from 'antd'
import { connect, useDispatch, useSelector } from 'react-redux'
import { CONTRACT_DETAILS, queryContractDetails } from '../../../actions'
import { percentFormat } from '../../../utils'
import RentCalcTable from '../RentCalcTable'
import { useParams } from 'utils/hooks'
import { ModalPrintPreviewButton, PageHeader } from '../../../components'
import _ from 'lodash'
import heraApi from 'api'
import { exportExcel } from 'utils/excel'

const ProjectLabel = connect(state => ({
  projects: state.system.projects,
}))(({ projects, projectId }) => {
  if (projects && projects.get(projectId)) {
    return <>{projects.get(projectId).completeName}</>
  }
  return <>projectId</>
})

const ButtonReCalc = props => {
  const { restartCal, id, calcId, currentCalc } = props
  return (
    <Button
      key="reCalc"
      onClick={() => {
        restartCal({
          id,
          calcId,
          calc: _.omit(currentCalc, ['list', 'history', 'group', 'nameGroup']),
        })
      }}
    >
      重新计算
    </Button>
  )
}

const ContractDetailsCalc = () => {
  const dispatch = useDispatch()
  let contract = useSelector(state => state.results.get(CONTRACT_DETAILS, {}))
  const projects = useSelector(state => state.system.projects)
  const projectName = projects
    ? _.get(projects.get(contract.project), 'completeName', '')
    : ''
  const { id, calcId } = useParams()
  const [restartCal, restartResult] = heraApi.useRestartCalcContractMutation()
  useEffect(() => {
    dispatch(queryContractDetails(id))
  }, [id])

  useEffect(() => {
    if (restartResult.isSuccess) {
      dispatch(queryContractDetails(id))
    }
  }, [restartResult.isSuccess])

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
    {
      label: '项目部',
      children: <ProjectLabel projectId={contract.project} />,
    },
    { label: '状态', children: <Tag color="green">{contract.status}</Tag> },
    { label: '签约时间', children: moment(contract.date).format('YYYY-MM-DD') },
    { label: '结算名称', children: currentCalc.name },
    {
      label: '结算开始日期',
      children: moment(currentCalc.start).format('YYYY-MM-DD'),
    },
    {
      label: '结算结束日期',
      children: moment(currentCalc.end).format('YYYY-MM-DD'),
    },
    { label: '税率', children: percentFormat(currentCalc.taxRate, 0) },
    {
      label: '合同费用规则是否已含税',
      children: <Tag>{currentCalc.includesTax ? '已含' : '不含'}</Tag>,
    },
    { label: '备注', children: contract.comments },
  ]

  return (
    <PageHeader
      title={`${contract.name}结算表`}
      subTitle={contract.code}
      descriptions={descriptions}
      extra={[
        <ButtonReCalc
          key="buttonReCalc"
          {...{ restartCal, id, calcId, currentCalc }}
        />,
        <ModalPrintPreviewButton
          key="printPreview"
          pdf={`/api/contract/${id}/calc/${calcId}/preview`}
        >
          打印预览
        </ModalPrintPreviewButton>,
        <Button
          type="primary"
          key="excel"
          onClick={() => {
            Promise.all([import('xlsx'), import('xlsx-style-hzx')])
              .then(([XLSX, XLSX_STYLE]) => {
                exportExcel(
                  { XLSX, XLSX_STYLE },
                  currentCalc,
                  currentCalc.name + '-' + projectName
                )
              })
              .catch(e => {
                alert('加载 Excel 控件失败，请重试', e)
              })
          }}
        >
          导出 EXCEL
        </Button>,
      ]}
    >
      <Card>{currentCalc && <RentCalcTable rent={currentCalc} />}</Card>
    </PageHeader>
  )
}

export default ContractDetailsCalc