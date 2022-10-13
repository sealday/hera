/**
 * @format
 */
import 'react-native-reanimated'
import { AppRegistry } from 'react-native';
import { App } from './src'
import { name as appName } from './app.json';
import { hello } from 'common'

hello()
AppRegistry.registerComponent(appName, () => App);