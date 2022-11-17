import {
  Modal,
  Form,
  Select,
  DatePicker,
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
import moment from 'moment'
import { DateModifier } from '../../../components'
import { RULE_CATEGORIES } from '../../../constants'

const ContractAddItemModal = ({ initialValues, onFinish, rules, open, onClose }) => {
  const [form] = useForm()
  return <Modal
    title="合同规则明细"
    open={open}
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
        label="计费分类"
        name="category"
        rules={[{ required: true, message: '此处为必填项！' }]}
      >
        <Select onChange={() => form.resetFields(['plan'])}
          options={RULE_CATEGORIES.filter(category => category.value !== '计重')}
        />
      </Form.Item>
      <Form.Item
        noStyle
        dependencies={['category']}>
        {() => {
          return <Form.Item
            label="计费规则"
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
        label="计重规则"
        name="weight"
      >
        <Select showSearch optionFilterProp="label"
          options={
            rules
              .filter(rule => rule.category === '计重')
              .map(rule => ({ label: rule.name, value: rule._id }))
              .concat({ label: '默认计重规则', value: null })
          }
        />
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