import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux'
import { App } from './app'
import { store } from './store';

const WrapperApp = () => {
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </RootSiblingParent>
    </Provider>
  )
}

export { WrapperApp as App }