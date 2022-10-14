import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './screens/login';
import { ScanScreen } from './screens/scan';
import { useEffect, useState } from 'react';
import { updateToken } from './features/coreSlices';
import { HomeScreen } from './screens/home';
import { useDispatch, useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoading, setLoading] = useState(true)
  const isLogined = useSelector(state => state.core.isLogined)
  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token')
      dispatch(updateToken(token))
      setLoading(false)
    })()
  }, [])
  if (isLoading) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogined ?
          <>
            <Stack.Screen name='Home' component={HomeScreen} options={{
              header: () => { }
            }}
            />
            <Stack.Screen
              name='Scan'
              component={ScanScreen}
              options={{
                title: '扫一扫',
              }}
            />
          </>
          :
          <>
            <Stack.Screen
              name='Login'
              component={LoginScreen}
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

export { App };