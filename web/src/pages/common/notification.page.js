import { Button } from "antd"
import heraApi from "api"
import { Error, LinkButton, Loading, PageHeader, ResultTable } from "components"
import _ from "lodash"
import NotificationSchema from "schema/notification.schema"
import { genTableColumn } from "utils/antd"

const NotificationPage = () => {

  const getNotificationList = heraApi.useGetNotificationListAllQuery()
  const [readNotification] = heraApi.useReadNotificationMutation()

  if (getNotificationList.isLoading) {
    return <Loading />
  }

  if (getNotificationList.isError) {
    return <Error />
  }

  const columns = genTableColumn(NotificationSchema).concat([
    {
      title: '其他', key: 'other', render(notification) {
        // 处理包含订单的情况
        if (_.includes(notification.tags, 'orders')) {
          return notification.extra.records.map(record => (
            <LinkButton to={`/record/${record._id}`} key={record.number}>{record.number}</LinkButton>
          ))
        }
      }
    },
    {
      title: '操作', key: 'action', render(notification) {
        return <Button onClick={() => readNotification(notification._id)}>已读</Button>
      }
    }
  ])

  return (
    <PageHeader title='通知列表'>
      <ResultTable columns={columns} dataSource={getNotificationList.data} />
    </PageHeader>
  )
}

export default NotificationPage