import { Button, ConfigProvider, Form, Modal } from "antd";
import { useState } from "react";
import { generateFormContent } from "../../utils";
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
    form.submit()
    hideModal()
  }

  const formContent = generateFormContent(schema, 2)
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