import { Button, Card, Header, Text } from '@rneui/themed';
import {
  ScrollView,
  StyleSheet, View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from './store';

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
      />
      <ScrollView>
        <Card>
          <Card.Title>入库单</Card.Title>
          <Card.Divider />
          <Text>15 单</Text>
          <Button raised onPress={() => navigation.push('Login')} title='登录' />
        </Card>
        <Card>
          <Card.Title>出库单</Card.Title>
          <Card.Divider />
          <Text>14 单</Text>
        </Card>
        <Card>
          <Card.Title>出库单</Card.Title>
          <Card.Divider />
          <Text>14 单</Text>
        </Card>
        <Card>
          <Card.Title>入库单</Card.Title>
          <Card.Divider />
          <Text>14 单</Text>
        </Card>
        <Card>
          <Card.Title>出库单</Card.Title>
          <Card.Divider />
          <Text>14 单</Text>
        </Card>
        <Card>
          <Card.Title>出库单</Card.Title>
          <Card.Divider />
          <Text>14 单</Text>
        </Card>
        <Card>
          <Card.Title>入库单</Card.Title>
          <Card.Divider />
          <Text>14 单</Text>
        </Card>
        <Card>
          <Card.Title>出库单</Card.Title>
          <Card.Divider />
          <Text>14 单</Text>
        </Card>
        <Card>
          <Card.Title>出库单</Card.Title>
          <Card.Divider />
          <Text>14 单</Text>
        </Card>
      </ScrollView>
    </View>
  )
}

const LoginScreen = () => {
  <View>
    <Text>登录</Text>
  </View>
}


const App = () => {
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