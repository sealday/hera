import 'react-native-reanimated'
import { Button, Card, Header, Text, Input, Icon } from '@rneui/themed';
import {
  ScrollView,
  StyleSheet, View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store } from '../store';
import { login } from '../features/coreSlices';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { useEffect, useState } from 'react';

const useCameraPermission = () => {
  const [result, setResult] = useState(null)
  useEffect(() => {
    Camera.getCameraPermissionStatus().then((cameraPermission) => {
      if (cameraPermission === 'not-determined') {
        Camera.requestCameraPermission().then((cameraPermission) => {
          setResult(cameraPermission)
        })
      } else {
        setResult(cameraPermission)
      }
    })
  }, [])
  return result
}

const ScanScreen = () => {
  const dispatch = useDispatch()
  const devices = useCameraDevices('wide-angle-camera')
  const device = devices.back
  const navigation = useNavigation()
  const cameraPermission = useCameraPermission()
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });
  if (device === null || cameraPermission === null || cameraPermission !== 'authorized' ) {
    return null
  }


  return (
    <View>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      {barcodes.map((barcode, idx) => (
          <Text key={idx} style={styles.barcodeTextURL}>
            {barcode.displayValue}
          </Text>
        ))}
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
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export { ScanScreen }