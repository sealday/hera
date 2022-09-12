import { PrinterOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Drawer, Modal } from "antd";
import { useRef, useState } from "react";
import PrintFrame from "../print-frame.component";
export default ({ title, content, children, ...btnProps }) => {
  const [open, setOpen] = useState(false);
  const printFrame = useRef()

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };
  return (
    <>
      <Button {...btnProps} onClick={showModal}>
        {children}
      </Button>
      <ConfigProvider componentSize='middle'>
        <Drawer
          title={title}
          placement='bottom'
          height={520}
          open={open}
          onClose={hideModal}
          extra={
            <Button type='primary' icon={<PrinterOutlined />} onClick={() => printFrame.current.print()}>打印</Button>
          }
        >
          <PrintFrame ref={printFrame}>
            {content}
          </PrintFrame>
        </Drawer>
      </ConfigProvider>
    </>
  );
};