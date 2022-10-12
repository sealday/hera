import { Card, Col, DatePicker, Form, Input, Row, Select } from "antd"
import { RULE_CATEGORIES } from "../../../constants"
import RuleOtherList from "./rule.other.list"
import RuleRentList from "./rule.rent.list"
import RuleWeightList from "./rule.weight.list"

const styles = {
  keepSpace: { marginTop: '8px' },
  block: { width: '100%' },
  titleContainer: {
    paddingLeft: '11px',
    paddingBottom: '8px',
    fontWeight: '500',
  },
}
export default ({ form, initialValues, onSubmit, category }) => {
  return (
    <Form colon={false} form={form} initialValues={initialValues} onFinish={onSubmit}>
      <Card title='基本信息'>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name='name' label='名称'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='date' label='日期'>
              <DatePicker style={styles.block} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name='comments' label='备注'>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      {
        category === '租金'
          ? <RuleRentList form={form} />
          : category === '计重'
            ? <RuleWeightList form={form} />
            : category === '非租'
              ? <RuleOtherList form={form} />
              : null
      }
    </Form>
  )
}