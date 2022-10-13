import { Button, Card, Header, Text, Input, Icon } from '@rneui/themed';
import {
  ScrollView,
  StyleSheet, View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from './store';
import { LoginScreen } from './screens/login';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ScanScreen } from './screens/scan';
import { hello } from '@hera/common'

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



const App = () => {
  hello()
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={HomeScreen} options={{
              header: () => { }
            }}
            />
            <Stack.Screen
              name='Login'
              component={LoginScreen}
              options={{
                title: '登录',
              }}
            />
            <Stack.Screen
              name='Scan'
              component={ScanScreen}
              options={{
                title: '扫一扫',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },

  icon: {
    width: 84,
    alignSelf: 'center',
  },
  iconContainer: {
    height: 150,
    alignContent: 'center',
    justifyContent: 'center',
    paddingTop: 48,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export { App };