import { Button, Card, Header, Text, Input, Icon } from '@rneui/themed';
import {
  ScrollView,
  StyleSheet, View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from './../store';
import { login } from '../features/coreSlices';

const LoginScreen = () => {
  const dispatch = useDispatch()
  const onLogin = () => {
    dispatch(login())
  }
  return (
    <View>
      <Card>
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            <Icon
              name='lock'
              type='antdesign'
              color='rgb(245, 0, 87)'
              reverse
              size={32}
            />
          </View>
        </View>
        <Card.Title style={styles.title}>赫拉管理系统</Card.Title>
        <Card.Divider />
        <Input label='操作员' textContentType='username' autoCapitalize='none' />
        <Input label='密码' textContentType='password' secureTextEntry />
        <Button title='登录' onPress={onLogin} />
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
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

export { LoginScreen }