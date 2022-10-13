import { Button, Card, Header, Text, Icon } from '@rneui/themed';
import {
  ScrollView,
  StyleSheet, View,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  const navigation = useNavigation()
  const isLogined = useSelector(state => state.core.isLogined)

  useFocusEffect(() => {
    if (!isLogined) {
      navigation.navigate('Login')
    }
  })
  if (!isLogined) {
    return <Text>未登录</Text>
  }
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
          <Button raised onPress={() => navigation.push('Login')} title='登录' />
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