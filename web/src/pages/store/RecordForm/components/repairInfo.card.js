import { Card, Col, Form, Row } from 'antd'
import { styles } from '../utils/constants'
import ComplementForm from './form/complement.form'

const RepairInfoCard = props => {
  const { title } = props
  return (
    <Card bordered={false} title={title} style={styles.keepSpace}>
      <Row>
        <Col span={24}>
          <Form.List name="complements">
            {(fields, operation, meta) => (
              <ComplementForm
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

export default RepairInfoCard
