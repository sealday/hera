import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from "antd"
import { RefCascader } from "../../../components"
import { RULE_CATEGORIES } from "../../../constants"
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
      <Col style={styles.titleContainer} flex='70px'>层级</Col>
      <Col style={styles.titleContainer} flex='300px'>关联产品</Col>
      <Col style={styles.titleContainer} flex='300px'>计费项目</Col>
      <Col style={styles.titleContainer} flex='100px'>单价</Col>
      <Col style={styles.titleContainer} flex='100px'>计算类型</Col>
      <Col style={styles.titleContainer} flex='auto'>备注</Col>
      <Col style={styles.titleContainer} flex='20px'></Col>
    </Row>
    <Form.List name='items'>
      {(fields, { add, remove }) => {
        return (
          <>{fields.map(field => (
            <Row gutter={8} key={field.key}>
              <Col flex='70px'>
                <Form.Item {...field} name={[field.name, 'level']}>
                  <Select options={[
                    { label: '产品', value: '产品' },
                    { label: '规格', value: '规格' },
                    { label: '按单', value: '按单' },
                  ]} />
                </Form.Item>
              </Col>
              <Col flex='300px'>
                <Form.Item noStyle dependencies={[['items', field.key, 'level']]}>
                  {() => {
                    const level = form.getFieldValue(['items', field.key, 'level'])
                    const product = form.getFieldValue(['items', field.key, 'associate'])
                    if (level === '产品') {
                      if (product && product.length === 3) {
                        form.setFieldValue(['items', field.key, 'associate'], product.slice(0, 2))
                      }
                      return <RefCascader
                        item={{ required: true, name: [field.name, 'associate'], option: { ref: 'product' } }}
                        customBuild={data => buildProductTree(data, false).children} />
                    } else if (level === '规格') {
                      return <RefCascader
                        item={{ required: true, name: [field.name, 'associate'], option: { ref: 'product' } }}
                        customBuild={data => buildProductTree(data).children} />
                    }
                  }}
                </Form.Item>
              </Col>
              <Col flex='300px'>
                <RefCascader
                  item={{ required: true, name: [field.name, 'product'], option: { ref: 'product' } }}
                  customBuild={data => buildProductTree(data).children} />
              </Col>
              <Col flex='100px'>
                <Form.Item {...field} name={[field.name, 'unitPrice']}>
                  <Input />
                </Form.Item>
              </Col>
              <Col flex='100px'>
                <Form.Item {...field} name={[field.name, 'countType']}>
                  <Select options={[
                    { label: '数量', value: '数量' },
                    { label: '换算数量', value: '换算数量' },
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
                <Button type='text' onClick={() => remove(field.key)} icon={<MinusCircleOutlined />} />
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
        )
      }}
    </Form.List>
  </Card>
)