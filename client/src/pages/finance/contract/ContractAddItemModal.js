import {
  Modal,
  Form,
  Select,
  DatePicker,
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
import moment from 'moment'
import heraApi from '../../../api'
import { DateModifier, Error, Loading } from '../../../components'
import { RULE_CATEGORIES } from '../../../constants'

const ContractAddItemModal = ({ initialValues, onFinish, rules, visible, onClose }) => {
  const [form] = useForm()
  return <Modal
    title="合同规则明细"
    visible={visible}
    onOk={() => form.submit()}
    onCancel={() => onClose()}>
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      name="合同规则明细"
      form={form}
      initialValues={initialValues}
      onFinish={v => {
        onFinish(v)
        onClose()
      }}
    >
      <Form.Item
        label="方案分类"
        name="category"
        rules={[{ required: true, message: '此处为必填项！' }]}
      >
        <Select onChange={() => form.resetFields(['plan'])}
          options={RULE_CATEGORIES.map(v => ({ label: v, value: v }))}
        />
      </Form.Item>
      <Form.Item
        noStyle
        dependencies={['category']}>
        {() => {
          return <Form.Item
            label="方案"
            name="plan"
            rules={[{ required: true, message: '此处为必填项！' }]}
          >
            <Select showSearch optionFilterProp="label"
            options={
                rules
                  .filter(rule => rule.category === form.getFieldValue('category'))
                  .map(rule => ({ label: rule.name, value: rule._id }))
            }
            />
          </Form.Item>;
        }}
      </Form.Item>
      <Form.Item
        label="时间区间"
        name="date"
        rules={[{ required: true, message: '此处为必填项！' }]}
      >
        <DatePicker.RangePicker
          renderExtraFooter={
            () => <DateModifier
              setDate={date => form.setFieldsValue({ date })}
              date={form.getFieldValue('date') ? form.getFieldValue('date')[0] : moment()}
            />
          }
        />
      </Form.Item>
    </Form>
  </Modal>
}
export default ContractAddItemModal