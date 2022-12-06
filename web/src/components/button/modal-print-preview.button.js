import { PrinterOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Drawer, Modal } from "antd";
import { useRef, useState } from "react";
import PrintFrame from "../print-frame.component";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { getAuthToken } from "utils";

export default ({ pdf, title, content, children, ...btnProps }) => {
  const [open, setOpen] = useState(false);
  const printFrame = useRef()
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
          {
            pdf
              ?
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={pdf + '?token=' + getAuthToken()}
                  plugins={[
                    // Register plugins
                    defaultLayoutPluginInstance,
                  ]}
                />
              </Worker>
              :
              <PrintFrame ref={printFrame}>
                {content}
              </PrintFrame>
          }
        </Drawer>
      </ConfigProvider>
    </>
  );
};