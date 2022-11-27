import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Row, Select } from "antd"
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
export default () => {
  const form = Form.useFormInstance()
  return (
    <Card style={styles.keepSpace} title='规则明细'>
      <Row gutter={8}>
        <Col style={styles.titleContainer} flex='70px'>层级</Col>
        <Col style={styles.titleContainer} flex='300px'>关联产品</Col>
        <Col style={styles.titleContainer} flex='200px'>计费项目</Col>
        <Col style={styles.titleContainer} flex='100px'>单价</Col>
        <Col style={styles.titleContainer} flex='110px'>计算类型</Col>
        <Col style={styles.titleContainer} flex='110px'>数量</Col>
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
                  <Form.Item noStyle dependencies={[['items', field.name, 'level']]}>
                    {() => {
                      const level = form.getFieldValue(['items', field.name, 'level'])
                      const product = form.getFieldValue(['items', field.name, 'associate'])
                      if (level === '产品') {
                        if (product && product.length === 3) {
                          form.setFieldValue(['items', field.name, 'associate'], product.slice(0, 2))
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
                <Col flex='200px'>
                  <RefCascader
                    item={{ required: true, name: [field.name, 'other'], option: { ref: 'other', label: 'name', value: 'id' } }} />
                </Col>
                <Col flex='100px'>
                  <Form.Item {...field} name={[field.name, 'unitPrice']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col flex='110px'>
                  <Form.Item noStyle dependencies={[['items', field.name, 'level']]}>
                    {() => {
                      const options = []
                      const level = form.getFieldValue(['items', field.name, 'level'])
                      if (level !== '按单') {
                        options.push(
                          { label: '数量', value: '数量' },
                          { label: '换算数量', value: '换算数量' },
                          { label: '重量', value: '重量' },
                        )
                      } else {
                        options.push(
                          { label: '重量', value: '重量' },
                          { label: '实际重量', value: '实际重量' },
                        )
                      }
                      return (
                        <Form.Item {...field} name={[field.name, 'countType']}>
                          <Select options={options} />
                        </Form.Item>
                      )
                    }}
                  </Form.Item>
                </Col>
                <Col flex='110px'>
                  <Form.Item {...field} name={[field.name, 'countSource']}>
                    <Select options={[
                      { label: '手动输入', value: '手动输入' },
                      { label: '出库数量', value: '出库数量' },
                      { label: '入库数量', value: '入库数量' },
                      { label: '出入库数量', value: '出入库数量' },
                      { label: '合同运费', value: '合同运费' },
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
                  <Button block type='dashed' onClick={() => add({ countSource: '手动输入' })} icon={<PlusCircleOutlined />}>新增</Button>
                </Col>
              </Row>

            </>
          )
        }}
      </Form.List>
    </Card>
  )
}