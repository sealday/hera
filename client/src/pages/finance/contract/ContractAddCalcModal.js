import { useForm } from 'antd/lib/form/Form'
import { DateModifier } from '../../../components'
import moment from 'moment'
import { Form, Modal, DatePicker, Input } from 'antd'

const ContractAddCalcModal = ({ initialValues, onFinish, visible, onClose }) => {
    const [form] = useForm()
    return <Modal
      title="结算单"
      visible={visible}
      onOk={() => form.submit()}
      onCancel={() => onClose()}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        name="结算单"
        form={form}
        initialValues={initialValues}
        onFinish={v => {
            onFinish(v)
            onClose()
        }}
      >
        <Form.Item
          label="结算名称"
          name="name"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="时间区间"
          name="date"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <DatePicker.RangePicker
            renderExtraFooter={
              () => <DateModifier
                setDate={date => {
                  form.setFieldsValue({ date })
                }}
                date={form.getFieldValue('date') ? form.getFieldValue('date')[0] : moment()}
              />
            }
          />
        </Form.Item>
      </Form>
    </Modal>
}
export default ContractAddCalcModal