import _ from 'lodash'
import { Button, Card, Dropdown, Menu, PageHeader } from 'antd'

const OrderPreview = ({ router }) => {
  const onPrint = () => {
    // printFrame.current.print()
  }
  return <>
    <PageHeader
      title="打印预览"
      ghost={false}
      extra={[
        <Button key={1} onClick={() => router.goBack()}>返回</Button>,
        // <Dropdown overlay={menu} trigger={['click']} key={2}><Button>切换打印用公司</Button></Dropdown>,
        <Button key={3} type="primary" onClick={onPrint}>打印</Button>,
      ]}
    />
    <div style={{ height: '8px' }}></div>
    <Card>
    </Card>
  </>
}

export default OrderPreview