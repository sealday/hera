import 'react-native-reanimated'
import { Text } from '@rneui/themed';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
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
      } else if (cameraPermission === 'denied' && Platform.OS === 'android') {
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
  const devices = useCameraDevices()
  const device = devices.back
  const cameraPermission = useCameraPermission()
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });
  if (typeof device === 'undefined' || device === null || cameraPermission === null || cameraPermission !== 'authorized' ) {
    return null
  }
  console.log(barcodes)

  return (
    <>
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
    </>

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