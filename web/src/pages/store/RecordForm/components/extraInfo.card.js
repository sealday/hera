import { Card, Col, Form, Row } from 'antd'
import { styles } from '..//utils/constants'
import AdditionalForm from './form/additional.form'

const ExtraInfoCard = props => {
  const { title } = props
  return (
    <Card title={title} bordered={false} style={styles.keepSpace}>
      <Row>
        <Col span={24}>
          <Form.List name="additionals">
            {(fields, operation, meta) => (
              <AdditionalForm
                fields={fields}
                operation={operation}
                meta={meta}
              />
            )}
          </Form.List>
        </Col>
      </Row>
    </Card>
  )
}

export default ExtraInfoCard
