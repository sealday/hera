import { Button, Card, Text } from '@rneui/themed';
import { ScrollView, View } from 'react-native';
import { useDispatch } from 'react-redux'
import { logout } from '../features/coreSlices';

const HomeScreen = () => {
  const dispatch = useDispatch()
  return (
    <View>
      <ScrollView>
        <Card>
          <Card.Title>入库单</Card.Title>
          <Card.Divider />
          <Text>15 单</Text>
        </Card>
      </ScrollView>
    </View>
  )
}

export { HomeScreen }