import { Modal, Form, Input, Select, DatePicker, InputNumber, Switch } from 'antd'
import { antFilterOption } from '../../../components'

const ContractEditModal = ({
  initialValues,
  onFinish,
  projects,
  open,
  onClose,
}) => {
  const [form] = Form.useForm()
  return (
    <Modal
      title="合同基础信息编辑"
      open={open}
      onOk={() => form.submit()}
      onCancel={() => onClose()}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        name="合同基础信息"
        form={form}
        initialValues={initialValues}
        onFinish={v => {
          onFinish(v)
          onClose()
        }}
      >
        <Form.Item
          label="合同名称"
          name="name"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="合同编号"
          name="code"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="项目部"
          name="project"
          rules={[{ required: true, message: '此处为必填项！' }]}
        >
          <Select showSearch filterOption={antFilterOption}>
            {projects.map(p => (
              <Select.Option key={p._id} value={p._id} pinyin={p.pinyin}>
                {p.completeName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="地址" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="日期" name="date">
          <DatePicker />
        </Form.Item>
        <Form.Item label="税率" name="taxRate">
          <InputNumber
            max={1}
            min={0}
            step={0.01}
            addonAfter="%"
            parser={v => v / 100}
            formatter={v => v * 100}
          />
        </Form.Item>
        <Form.Item
          label="合同费用规则是否已含税"
          name="includesTax"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="是否启用自动结算"
          name="isScheduled"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item label="每月" name="scheduledAt">
          <InputNumber max={28} min={0} step={1} addonAfter="日" />
        </Form.Item>
        <Form.Item label="备注" name="comments">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ContractEditModal