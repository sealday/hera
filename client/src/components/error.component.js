import { Card, Result } from "antd";
import { PageHeader } from ".";

export default ({ message }) => <PageHeader title='错误页面'>
  <Card bordered={false}>
    <Result
      status='error'
      title={message ? message : '出错了'}
    >
    </Result>
  </Card>
</PageHeader>