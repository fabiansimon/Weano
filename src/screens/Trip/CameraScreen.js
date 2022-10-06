import {
  Dimensions,
  ImageBackground,
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Headline from '../../components/typography/Headline';
import i18n from '../../utils/i18n';
import Button from '../../components/Button';

import Utils from '../../utils';

let camera;
export default function CameraScreen() {
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState(null);

  const [timer, setTimer] = useState(120);
  const navigation = useNavigation();

  const changeFlash = () => { setFlashMode((current) => (current === FlashMode.on ? FlashMode.off : FlashMode.on)); };

  const captureImage = () => {
    if (camera) {
      camera.takePictureAsync({ onPictureSaved });
    }
  };

  const onPictureSaved = (photo) => {
    setCapturedImage(photo);
  };

  const rotateCamera = () => { setCameraType((current) => (current === CameraType.back ? CameraType.front : CameraType.back)); };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Headline text="We need your permission to show the camera" />
        <Button onPress={requestPermission} text="grant permission" />
      </View>
    );
  }

  const RoundedBackButton = () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      activeOpacity={0.9}
      style={styles.roundButton}
    >
      <Icon
        name="arrowleft"
        color={COLORS.neutral[300]}
        size={22}
      />
    </TouchableOpacity>
  );

  const CaptureContainer = () => (
    <View style={{ position: 'absolute', width: Dimensions.get('window').width }}>
      <Animatable.View
        animation="bounceInDown"
        easing="ease-out"
        style={styles.captureContainer}
      >
        <View style={{ textAlign: 'center' }}>
          <Headline
            type={4}
            isDense
            text={i18n.t('Capture now')}
            color={COLORS.shades[0]}
          />
        </View>
      </Animatable.View>
    </View>
  );
  const FooterContainer = () => {
    const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
    return (
      <View style={styles.footerContainer}>
        <View style={styles.countdown}>
          <Headline
            type={3}
            color={COLORS.shades[0]}
            text={moment.utc(timer * 1000).format('mm:ss')}
          />
        </View>
        <View style={styles.recordUnit}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.flashButton, flashMode === FlashMode.on ? styles.flashOn : styles.flashOff]}
            onPress={changeFlash}
          >
            <IonIcons
              name="ios-flash"
              color={flashMode === FlashMode.on ? COLORS.neutral[500] : COLORS.shades[0]}
              size={18}
            />
          </TouchableOpacity>
          <AnimatableTouchableOpacity
            onPress={captureImage}
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            activeOpacity={0.9}
            style={styles.recordButton}
          >
            <View
              style={{
                backgroundColor: COLORS.shades[0],
                height: 54,
                width: 54,
                borderRadius: RADIUS.xl,
              }}
            />
          </AnimatableTouchableOpacity>
          <TouchableOpacity
            onPress={rotateCamera}
            activeOpacity={0.9}
            style={styles.flipButton}
          >
            <MatIcon
              name="flip-camera-android"
              color={COLORS.shades[0]}
              size={22}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CameraPreview = () => (
    <TouchableOpacity
      onPress={() => setCapturedImage(null)}
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <ImageBackground
          // eslint-disable-next-line react/destructuring-assignment
        source={{ uri: capturedImage.uri || null }}
        style={{
          flex: 1,
        }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {capturedImage ? <CameraPreview /> : (
        <>
          <Camera
            style={{ flex: 1 }}
            flashMode={flashMode}
            type={cameraType}
            ref={(r) => {
              camera = r;
            }}
          />
          <SafeAreaView style={styles.overlay} edges={['top']}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CaptureContainer />
              <RoundedBackButton />
            </View>
            <FooterContainer />
          </SafeAreaView>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  captureContainer: {
    alignSelf: 'center',
    height: 35,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  roundButton: {
    marginLeft: PADDING.m,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    backgroundColor: COLORS.shades[100],
  },
  flashButton: {
    borderRadius: RADIUS.xl,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashOff: {
    borderWidth: 1,
    borderColor: COLORS.shades[0],
  },
  flashOn: {
    backgroundColor: COLORS.shades[0],
  },
  flipButton: {
    borderRadius: RADIUS.xl,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Utils.addAlpha(COLORS.neutral[50], 0.2),
  },
  recordButton: {
    marginHorizontal: 24,
    height: 66,
    width: 66,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.shades[0],
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordUnit: {
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.4),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 110,
    paddingTop: 50,
    marginTop: 15,
    justifyContent: 'center',
    flex: 1,
  },
  countdown: {
    borderWidth: 0.5,
    borderColor: Utils.addAlpha(COLORS.neutral[300], 0.5),
    alignSelf: 'center',
    width: 100,
    paddingHorizontal: 12,
    borderRadius: RADIUS.l,
    height: 40,
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
