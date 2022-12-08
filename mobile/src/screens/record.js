import { Button, Card, ListItem, Text } from '@rneui/themed';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useDispatch } from 'react-redux'
import { logout } from '../features/coreSlices';
import { heraApi } from '../store';
import { useRoute } from '@react-navigation/native';
import { Error } from '../components/error';
import { Loading } from '../components/loading';
import _ from 'lodash'
import moment from 'moment'

const RecordScreen = () => {
  const dispatch = useDispatch()
  const route = useRoute()
  const { id } = route.params
  const getRecord = heraApi.useGetRecordQuery(id)
  const getProjectListAll = heraApi.useGetProjectListAllQuery()
  const record = getRecord.data
  const projects = getProjectListAll.data
  if (getRecord.isError || getProjectListAll.isError) {
    console.log(getRecord.error)
    console.log(getProjectListAll.error)
    return <Error />
  }
  if (getRecord.isLoading || getProjectListAll.isLoading) {
    return <Loading />
  }

  const descriptions = []
  if (record.type !== '盘点') {
    descriptions.push({ label: '出库项目/仓库', children: _.get(projects.find(p => p._id === record.outStock), 'name') })
    descriptions.push({ label: '入库项目/仓库', children: _.get(projects.find(p => p._id === record.inStock), 'name') })
  } else {
    descriptions.push({ label: '仓库盘点', children: _.get(projects.find(p => p._id === record.inStock), 'name') })
  }
  descriptions.push({ label: '出库时间', children: moment(record.outDate).format('YYYY-MM-DD') })
  descriptions.push({ label: '制单人', children: record.username })
  descriptions.push({ label: '原始单号', children: record.originalOrder })
  descriptions.push({ label: '车号', children: record.carNumber })
  descriptions.push({ label: '实际重量', children: record.weight ? record.weight + '吨' : '' })
  descriptions.push({ label: '合同运费', children: record.freight ? '计入合同' : '不计入合同' })
  descriptions.push({ label: '备注', children: record.comments })
  return (
    <ScrollView refreshControl={<RefreshControl
      onRefresh={() => getRecord.refetch()}
      refreshing={getRecord.isLoading}
    />}>
      <Card>
        <Card.Title>{record.type}单 No.{record.number}</Card.Title>
        <Card.Divider />
        {descriptions.map(item => (
          <ListItem key={item.label}>
            <ListItem.Content>
              <ListItem.Title>{item.label}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Content right>
              <ListItem.Title>{item.children}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </Card>
      <Card>
        <Card.Title>明细信息</Card.Title>
        <Card.Divider />
        {record.entries.map(item => (
          <ListItem key={item._id} bottomDivider>
            <Text>{item.name}</Text>
            <Text>{item.size}</Text>
            <Text>{item.count}</Text>
          </ListItem>
        ))}
      </Card>
      <Card>
        <Card.Title>其他信息</Card.Title>
        <Card.Divider />
        {record.complements.map(item => (
          <ListItem key={item._id} bottomDivider>
            <ListItem.Content>
              {
                item.level === 'associated' ?
                  <Text>关联 {_.get(item, 'associate.type')}/{_.get(item, 'associate.name')}/{_.get(item, 'associate.size')}</Text>
                  : null
              }
              <Text>{JSON.stringify(item.product)} | {item.count}</Text>
            </ListItem.Content>
          </ListItem>
        ))}
      </Card>
    </ScrollView>
  )
}

export { RecordScreen }
