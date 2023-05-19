import {
  AutoComplete,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Switch,
} from 'antd'
import { RefSelect } from '../../../../components'
import { CAR_NUMBERS } from '../../../../constants'

import { RECORD_CLIENT_TYPES } from '../../../../utils'
import { styles, rules } from '../utils/constants'

const BaseInfoCard = props => {
  const { title, settings, projectItem } = props
  return (
    <Card bordered={false} title={title}>
      <Row gutter={24}>
        {settings.project ? (
          <Col span={8}>
            <Form.Item label="类别" name="type" rules={rules}>
              <Select>
                {RECORD_CLIENT_TYPES.map(name => (
                  <Select.Option key={name}>{name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        ) : null}
        {settings.project ? (
          <Col span={8}>
            <RefSelect item={projectItem} />
          </Col>
        ) : null}
        <Col span={8}>
          <Form.Item label="日期" name="outDate" rules={rules}>
            <DatePicker style={styles.block} />
          </Form.Item>
        </Col>
        {settings.originalOrder ? (
          <Col span={8}>
            <Form.Item label="原始单号" name="originalOrder">
              <Input />
            </Form.Item>
          </Col>
        ) : null}
        {settings.carNumber ? (
          <Col span={8}>
            <Form.Item label="车号" name="carNumber">
              <AutoComplete
                options={CAR_NUMBERS.map(item => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>
          </Col>
        ) : null}
        {settings.weight ? (
          <Col span={8}>
            <Form.Item label="重量" name="weight">
              <Input suffix="吨" />
            </Form.Item>
          </Col>
        ) : null}
        {settings.freight ? (
          <Col span={8}>
            <Form.Item label="合同运费" name="freight" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        ) : null}
        <Col span={24}>
          <Form.Item label="备注" name="comments">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  )
}

export default BaseInfoCard
