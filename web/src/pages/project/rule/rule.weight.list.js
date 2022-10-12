import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Row } from "antd"
import { RefCascader } from "../../../components"
import { buildProductTree } from "../../../utils"

const rules = [{ required: true }]
const styles = {
  keepSpace: { marginTop: '8px' },
  block: { width: '100%' },
  titleContainer: {
    paddingLeft: '11px',
    paddingBottom: '8px',
    fontWeight: '500',
  },
}
export default ({ form }) => (
  <Card style={styles.keepSpace} title='规则明细'>
    <Row gutter={8}>
      <Col style={styles.titleContainer} flex='300px'>产品</Col>
      <Col style={styles.titleContainer} flex='120px'>重量</Col>
      <Col style={styles.titleContainer} flex='auto'>备注</Col>
      <Col style={styles.titleContainer} flex='20px'></Col>
    </Row>
    <Form.List name='items'>
      {(fields, { add, remove }) => (
        <>{fields.map(field => (
          <Row gutter={8} key={field.key}>
            <Col flex='300px'>
              <RefCascader
                item={{ required: true, name: [field.name, 'product'], option: { ref: 'product' } }}
                customBuild={data => buildProductTree(data).children} />
            </Col>
            <Col flex='120px'>
              <Form.Item {...field} name={[field.name, 'weight']} rules={rules}>
                <Input />
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
        ))
        }
          <Row>
            <Col span={24}>
              <Button block type='dashed' onClick={() => add()} icon={<PlusCircleOutlined />}>新增</Button>
            </Col>
          </Row>
        </>
      )}
    </Form.List>
  </Card>
)