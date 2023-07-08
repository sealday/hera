import { SettingOutlined } from "@ant-design/icons"
import { Button, Card, Col, Popover, Radio, Row, Select } from "antd"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "utils/hooks"
import { useGetRecordQuery } from "../../api"
import { Error, Loading, PageHeader, PrintFrame } from "../../components"
import PrintContent from './PrintContent'

const RecordPreview = () => {
  const params = useParams()
  const config = useSelector(state => state.system.config)
  const recordResult = useGetRecordQuery(params.id)
  const [columnStyle, setColumnStyle] = useState('double')
  const [selectedTitle, setSelectedTitle] = useState('')
  const [isNeedShowSubCount, setIsNeedShowSubCount] = useState(false)
  const [isNeedShowWeight, setIsNeedShowWeight] = useState(true)
  const printFrame = React.createRef()
  if (recordResult.isError) {
    return <Error />
  }
  if (recordResult.isLoading) {
    return <Loading />
  }
  // 打印样式
  const options = [
    { label: '单栏', value: 'single' },
    { label: '双栏', value: 'double' },
  ]

  // 小计显示
  const optionsSubCounts = [
    { label: '完全', value: true },
    { label: '精简', value: false },
  ]

  // 重量显示
  const optionsWeight = [
    { label: '显示', value: true },
    { label: '不显示', value: false },
  ]

  const content = (
    <div style={{ width: '240px' }}>
      <Row gutter={[24, 8]}>
        <Col span={8}>样式选择</Col>
        <Col span={16}>
          <Radio.Group
            key="columnStyle"
            options={options}
            onChange={e => setColumnStyle(e.target.value)}
            value={columnStyle}
            optionType="button"
          />
        </Col>

        <Col span={8}>小计显示</Col>
        <Col span={16}>
          <Radio.Group
            key="isNeedShowSubCount"
            options={optionsSubCounts}
            onChange={e => setIsNeedShowSubCount(e.target.value)}
            value={isNeedShowSubCount}
            optionType="button"
          />
        </Col>
        <Col span={8}>重量显示</Col>
        <Col span={16}>
          <Radio.Group
            key="isNeedShowWeight"
            options={optionsWeight}
            onChange={e => setIsNeedShowWeight(e.target.value)}
            value={isNeedShowWeight}
            optionType="button"
          />
        </Col>
        <Col span={8}>公司选择</Col>
        <Col span={16}>
          <Select
            dropdownMatchSelectWidth={false}
            placeholder="选择公司"
            style={{ width: '160px' }}
            value={selectedTitle}
            onChange={setSelectedTitle}
          >
            {config.externalNames.map(name => (
              <Select.Option key={name}>{name}</Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    </div>
  )

  const extra = [
    <Popover key="printSettings" trigger="click" content={content}>
      <Button icon={<SettingOutlined />}>打印设置</Button>
    </Popover>,
  ]
  return (
    <PageHeader
      title="打印预览"
      onPrint={() => printFrame.current.print()}
      extra={extra}
    >
      <Card bordered={false}>
        <PrintFrame ref={printFrame}>
          <PrintContent
            record={recordResult.data}
            columnStyle={columnStyle}
            isNeedShowSubCount={isNeedShowSubCount}
            isNeedShowWeight={isNeedShowWeight}
            selectedTitle={selectedTitle}
          />
        </PrintFrame>
      </Card>
    </PageHeader>
  )
}

export default RecordPreview