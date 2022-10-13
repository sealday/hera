import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux'
import { store } from './store';
import { LoginScreen } from './screens/login';
import { ScanScreen } from './screens/scan';
import { useEffect, useState } from 'react';
import { updateToken } from './features/coreSlices';
import { RootSiblingParent } from 'react-native-root-siblings';
import { HomeScreen } from './screens/home';

const Stack = createNativeStackNavigator();

const App = () => {

  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token')
      store.dispatch(updateToken(token))
      setLoading(false)
    })()
  }, [])
  if (isLoading) {
    return null;
  }
  return (
    <Provider store={store}>
      <RootSiblingParent>
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
      </RootSiblingParent>
    </Provider>
  );
};

export { App };