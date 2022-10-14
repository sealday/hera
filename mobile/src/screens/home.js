import { Button, Card, Header, Text, Icon } from '@rneui/themed';
import {
  ScrollView,
  StyleSheet, View,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { logout } from '../features/coreSlices';

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  return (
    <View>
      <Header
        centerComponent={{
          text: '赫拉管理系统',
          style: styles.title,
        }}

        rightComponent={
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Scan')} >
              <Icon
                name='scan1'
                type='antdesign'
                color='#FFF'
              />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView>
        <Card>
          <Card.Title>入库单</Card.Title>
          <Card.Divider />
          <Text>15 单</Text>
          <Button raised onPress={() => dispatch(logout())} title='注销' />
        </Card>
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
});

export { HomeScreen }