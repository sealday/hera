import { Button, Card, Header, Text, Input, Icon } from '@rneui/themed';
import {
  ScrollView,
  StyleSheet, View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector, useDispatch } from 'react-redux'
import { heraApi, store } from './../store';
import { login } from '../features/coreSlices';
import { useEffect, useState } from 'react';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [doLogin, loginResult] = heraApi.useLoginMutation()
  useEffect(() => {
    if (loginResult.isError) {
      Toast.show('账号或者密码错误', { duration: Toast.durations.SHORT, position: Toast.positions.CENTER })
    }
  }, [loginResult.isError])
  useEffect(() => {
    if (loginResult.isSuccess) {
      Toast.show('登录成功！', { duration: Toast.durations.SHORT, position: Toast.positions.CENTER })
      AsyncStorage.setItem('token', loginResult.data, () => {
        dispatch(login())
      })
    }
  }, [loginResult.isSuccess])
  const onLogin = () => {
    doLogin({ username, password })
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
        <Input label='操作员' value={username} onChangeText={setUsername} textContentType='username' autoCapitalize='none' />
        <Input label='密码' value={password} onChangeText={setPassword} textContentType='password' secureTextEntry />
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