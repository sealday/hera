import { useFocusEffect } from '@react-navigation/native';
import { ListItem } from '@rneui/themed';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import api from '../features/apiSlices';

const LogScreen = () => {
  const getOperations = api.useGetOperations()
  const onRefresh = useCallback(() => {
    getOperations.refresh()
  }, [])
  const onLoadMore = () => {
    getOperations.loadMore()
  }
  useEffect(() => {
    if (!getOperations.isRefreshing) {
      getOperations.loadMore()
    }
  }, [getOperations.isRefreshing])
  if (getOperations.isError) {
    return null
  }
  return (
    <FlatList
      data={getOperations.data}
      refreshing={getOperations.isRefreshing}
      onRefresh={onRefresh}
      keyExtractor={item => item._id}
      onEndReached={onLoadMore}
      ListFooterComponent={() => getOperations.isLoading ? <ActivityIndicator style={styles.loading} /> : null}
      renderItem={({ item }) => (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.type ? item.type : '修改'} - {item.user.username} - {item.report.message ? item.report.message : item.report.content}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron
            name='right'
            type='antdesign'
          />
        </ListItem>
      )}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  loading: {
    color: '#000',
  }
})

export { LogScreen }