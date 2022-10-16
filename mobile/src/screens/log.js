import { Button, Card, ListItem, Text } from '@rneui/themed';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux'
import { logout } from '../features/coreSlices';
import { heraApi } from '../store';

const LogScreen = () => {
  const dispatch = useDispatch()
  const getLatestOperationList = heraApi.useGetLatestOperationListQuery()
  if (getLatestOperationList.isError) {
    return null
  }
  if (getLatestOperationList.isLoading) {
    return null
  }
  const arr = [0]
  return (
    <View>
      <ScrollView>
        <Card>
          {getLatestOperationList.data.map(item => (
            <ListItem bottomDivider key={item._id}>
              <ListItem.Content>
                <ListItem.Title>{item.type ? item.type : '修改'} - {item.user.username} - {item.report.message ? item.report.message : item.report.content}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron 
                name='right'
                type='antdesign'
              />
            </ListItem>
          ))}
        </Card>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  }
})

export { LogScreen }