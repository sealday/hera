import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from "antd"
import { PageHeader, RefCascader } from "../../../components"
import { RULE_CATEGORIES } from "../../../constants"
import { buildProductTree } from "../../../utils"

const styles = {
  keepSpace: { marginTop: '8px' },
  block: { width: '100%' },
}
export default () => {

  return (
    <PageHeader
      title='合同计算规则'
      subTitle='正在录入'
    >
      <Form colon={false}>
        <Card title='基本信息'>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name='category' label='类型'>
                <Select options={RULE_CATEGORIES.map(rule => ({ label: rule, value: rule }))}></Select>
              </Form.Item>
            </Col>
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
        <Card style={styles.keepSpace} title='规则明细'>
          <Row gutter={8}>
            <Col flex='100px'>定价层级</Col>
            <Col flex='300px'>产品</Col>
            <Col flex='100px'>单价</Col>
            <Col flex='100px'>计算类型</Col>
            <Col flex='auto'>备注</Col>
            <Col flex='20px'></Col>
          </Row>
            <Form.List name='items'>
              {(fields, { add, remove }) => {
                return (
                  <>{fields.map(field => (
                    <Row gutter={8}>
                      <Col flex='100px'>
                        <Form.Item {...field} name={[field.name, 'level']}>
                          <Select options={[
                            { label: '产品', value: '产品' },
                            { label: '规格', value: '规格' },
                          ]} />
                        </Form.Item>
                      </Col>
                      <Col flex='300px'>
                        <RefCascader
                          item={{ required: true, name: [field.name, 'product'], option: { ref: 'product' } }}
                          customBuild={data => buildProductTree(data).children}
                        />
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
                        <Button block type='text' onClick={() => remove(field.key)} icon={<MinusCircleOutlined />} />
                      </Col>
                    </Row>
                  ))
                  }
                    <Row>
                      <Col span={24}>
                        <Button block type='dashed' onClick={add} icon={<PlusCircleOutlined />}>新增</Button>
                      </Col>
                    </Row>

                  </>
                )
              }}
            </Form.List>
        </Card>
      </Form>
    </PageHeader>
  )
}