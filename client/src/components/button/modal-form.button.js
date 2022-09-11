import { Button, ConfigProvider, Form, Modal } from "antd";
import { useState } from "react";
import { genFormContent } from "../../utils/antd";
export default ({ onSubmit, title, schema, initialValues, children, ...btnProps }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm()

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const onOk = () => {
    form.validateFields().then(() => {
      form.submit()
      hideModal()
    })
  }

  const formContent = genFormContent(schema, 2, form)
  return (
    <>
      <Button {...btnProps} onClick={showModal}>
        {children}
      </Button>
      <ConfigProvider componentSize='middle'>
        <Modal
          width={768}
          title={title}
          open={open}
          onOk={onOk}
          onCancel={hideModal}
          okText="保存"
          cancelText="取消"
        >
          <Form onFinish={onSubmit} form={form} initialValues={initialValues} colon={false} labelCol={{ flex: '100px' }}>
            {formContent}
          </Form>
        </Modal>
      </ConfigProvider>
    </>
  );
};