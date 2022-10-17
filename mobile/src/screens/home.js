import { useNavigation } from '@react-navigation/native';
import { Button, Card, Input, Text } from '@rneui/themed';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux'
import { logout } from '../features/coreSlices';

const HomeScreen = () => {
  const navigation = useNavigation()
  const [recordId, setRecordId] = useState()
  return (
    <View>
      <ScrollView>
        <Card>
          <Card.Title>出入库查询</Card.Title>
          <Card.Divider />
          <Input value={recordId} onChangeText={setRecordId} />
          <Button onPress={() => navigation.navigate('Record', { id: recordId })} title="查询" />
        </Card>
      </ScrollView>
    </View>
  )
}

export { HomeScreen }