import { PrinterOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Drawer, Modal } from "antd";
import { useRef, useState } from "react";
import PrintFrame from "../print-frame.component";
import { getAuthToken } from "utils";
import { useMemo } from "react";
import { lazy } from "react";
import { Suspense } from "react";
import { Loading } from "components";

export default ({ pdf, title, content, children, ...btnProps }) => {
  const [open, setOpen] = useState(false);
  const printFrame = useRef()
  const url = pdf ? pdf + '?token=' + getAuthToken() : null

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const PrintViewer = useMemo(() => {
    return lazy(() => import('../pdf-viewer.component'))
  }, [])

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
            <Button type='primary' icon={<PrinterOutlined />} onClick={() => {
              printFrame.current.print();
            }}>打印</Button>
          }
        >
          {
            pdf
              ?
              <Suspense fallback={<Loading />}>
                <PrintViewer url={url} printRef={printFrame} />
              </Suspense>
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