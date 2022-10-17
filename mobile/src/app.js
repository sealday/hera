import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './screens/login';
import { ScanScreen } from './screens/scan';
import { useEffect, useState } from 'react';
import { login } from './features/coreSlices';
import { HomeScreen } from './screens/home';
import { useDispatch, useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Header, Icon } from '@rneui/themed';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MyScreen } from './screens/my';
import { LogScreen } from './screens/log';
import { Loading } from './components/loading';
import { RecordScreen } from './screens/record';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

const TabContainer = () => {
  const navigation = useNavigation()
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} options={{
        title: '首页',
        tabBarIcon: () => (
          <Icon
            name='home'
            type='antdesign'
          />
        ),
        header: (props) => (
          <Header
            centerComponent={{
              text: props.options.title,
              style: styles.title,
            }}
            rightComponent={
              <TouchableOpacity onPress={() => {
                return navigation.navigate('Scan');
              }} >
                <Icon
                  name='scan1'
                  type='antdesign'
                  color='#FFF'
                />
              </TouchableOpacity>
            }
          />
        )
      }} />
      <Tab.Screen name='Log' component={LogScreen} options={{
        title: '日志',
        header: (props) => (
          <Header
            centerComponent={{
              text: props.options.title,
              style: styles.title,
            }}
          />
        ),
        tabBarIcon: () => (
          <Icon
            name='clockcircleo'
            type='antdesign'
          />
        ),
      }} />
      <Tab.Screen name='My' component={MyScreen} options={{
        title: '我的',
        header: (props) => (
          <Header
            centerComponent={{
              text: props.options.title,
              style: styles.title,
            }}
          />
        ),
        tabBarIcon: () => (
          <Icon
            name='user'
            type='antdesign'
          />
        ),
      }} />
    </Tab.Navigator>
  )
}

const App = () => {
  const [isLoading, setLoading] = useState(true)
  const isLogined = useSelector(state => state.core.isLogined)
  const token = useSelector(state => state.core.token)
  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token')
      console.log('token', token)
      console.log('isLogined', isLogined)
      if (token) {
        dispatch(login(token))
      }
      setLoading(false)
    })()
  }, [token])
  if (isLoading) {
    return <Loading />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogined ?
          <>
            <Stack.Screen name='Tab' component={TabContainer} options={{
              headerShown: false
            }}
            />
            <Stack.Screen name='Scan' component={ScanScreen}
              options={{
                title: '扫一扫',
              }}
            />
            <Stack.Screen name='Record' component={RecordScreen}
              options={{
                title: '出入库记录',
              }}
            />
          </>
          :
          <>
            <Stack.Screen name='Login' component={LoginScreen}
              options={{
                title: '登录',
                animationTypeForReplace: isLogined ? 'push' : 'pop',
              }}
            />
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: 'white',
  },
});

export { App };