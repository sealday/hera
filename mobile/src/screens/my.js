import { Button, Card } from '@rneui/themed';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux'
import { logout } from '../features/coreSlices';

const MyScreen = () => {
  const dispatch = useDispatch()
  const arr = [0]
  return (
    <View>
      <ScrollView>
        <Card>
          <Button  type='outline' onPress={() => dispatch(logout())} title='安全退出' style={styles.button} />
        </Card>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  }
})

export { MyScreen }