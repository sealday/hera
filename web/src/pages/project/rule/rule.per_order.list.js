import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Row, Select } from "antd"
import { RefCascader } from "../../../components"

const styles = {
  keepSpace: { marginTop: '8px' },
  block: { width: '100%' },
  titleContainer: {
    paddingLeft: '11px',
    paddingBottom: '8px',
    fontWeight: '500',
  },
}
const RulePerOrderList = () => {
  const form = Form.useFormInstance()
  return (
    <Card style={styles.keepSpace} title='规则明细'>
      <Row gutter={8}>
        <Col style={styles.titleContainer} flex='200px'>计费项目</Col>
        <Col style={styles.titleContainer} flex='200px'>单价</Col>
        <Col style={styles.titleContainer} flex='120px'>计算类型</Col>
        <Col style={styles.titleContainer} flex='auto'>备注</Col>
        <Col style={styles.titleContainer} flex='20px'></Col>
      </Row>
      <Form.List name='items'>
        {(fields, { add, remove }) => {
          return (
            <>{fields.map(field => (
              <Row gutter={8} key={field.key}>
                <Col flex='200px'>
                  <RefCascader
                    item={{ required: true, name: [field.name, 'other'], option: { ref: 'other', label: 'name', value: 'id' } }} />
                </Col>
                <Col flex='200px'>
                  <Form.Item {...field} name={[field.name, 'unitPrice']}>
                    <Input addonAfter='元' />
                  </Form.Item>
                </Col>
                <Col flex='120px'>
                  <Form.Item {...field} name={[field.name, 'countType']}>
                    <Select options={[
                      { label: '重量', value: '重量' },
                      { label: '实际重量', value: '实际重量' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col flex='auto'>
                  <Form.Item {...field} name={[field.name, 'comments']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col flex='20px'>
                  <Button type='text' onClick={() => remove(field.name)} icon={<MinusCircleOutlined />} />
                </Col>
              </Row>
            ))}
              <Row>
                <Col span={24}>
                  <Button block type='dashed' onClick={() => add()} icon={<PlusCircleOutlined />}>新增</Button>
                </Col>
              </Row>

            </>
          )
        } }
      </Form.List>
    </Card>
  )
}

export default RulePerOrderList