import {
  Dimensions,
  ImageBackground,
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import React, { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, S3_BUCKET } from '@env';
import Icon from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { manipulateAsync, FlipType } from 'expo-image-manipulator';
import { PinchGestureHandler } from 'react-native-gesture-handler';
import Video from 'react-native-video';
import { Credentials, S3 } from 'aws-sdk';
import { readFile } from 'react-native-fs';
import { decode } from 'base64-arraybuffer';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Headline from '../../components/typography/Headline';
import i18n from '../../utils/i18n';
import Button from '../../components/Button';
import Utils from '../../utils';

let camera;
export default function CameraScreen() {
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(120);

  const navigation = useNavigation();

  let lastPress = 0;
  const DOUBLE_PRESS_DELAY = 500;

  const handleImageUpload = async () => {
    const bucket = new S3({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      Bucket: S3_BUCKET,
      signatureVersion: 'v4',
    });

    const type = 'image/jpeg';
    const path = capturedImage.uri;
    const base64 = await readFile(path, 'base64');
    const arrayBuffer = decode(base64);

    bucket.createBucket(() => {
      const params = {
        Bucket: S3_BUCKET,
        Key: '12321312',
        Body: arrayBuffer,
        ContentDisposition: 'asv',
        ContentType: type,
      };

      bucket.upload(params, (err, data) => {
        if (err) {
          console.log(err);
        }
      });
    });

    setCapturedImage(null);

    // return {
    //   url,
    // };
  };

  const changeZoom = (event) => {
    if (event.nativeEvent.scale > 1 && zoom < 1) {
      setZoom(zoom + 0.001);
    }
    if (event.nativeEvent.scale < 1 && zoom > 0) {
      setZoom(zoom - 0.001);
    }
  };

  const changeFlash = () => { setFlashMode((current) => (current === FlashMode.on ? FlashMode.off : FlashMode.on)); };

  const handleCapture = async () => {
    if (isRecording) {
      endCaptureVideo();
      return;
    }

    if (camera) {
      camera.pausePreview();
      const image = await camera.takePictureAsync();
      let flippedImage;

      if (cameraType === CameraType.front) {
        flippedImage = await manipulateAsync(
          image.localUri || image.uri,
          [{ flip: FlipType.Horizontal }],
          { compress: 0.5 },
        );
      }

      onPictureSaved(cameraType === CameraType.front ? flippedImage : image);
    }
  };

  const onPictureSaved = (image) => {
    setCapturedImage(image);
  };

  const rotateCamera = () => { setCameraType((current) => (current === CameraType.back ? CameraType.front : CameraType.back)); };

  const startCaptureVideo = async () => {
    setIsRecording(true);
    const options = {
      maxDuration: 10,
    };
    const video = await camera.recordAsync(options);
    setCapturedVideo(video);
  };

  const endCaptureVideo = () => {
    setIsRecording(false);
    camera.stopRecording();
  };

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

  const checkDoublePress = () => {
    const time = new Date().getTime();
    const delta = time - lastPress;

    if (delta < DOUBLE_PRESS_DELAY && !isRecording) {
      rotateCamera();
    }
    lastPress = time;
  };

  const RoundedBackButton = () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      activeOpacity={0.9}
      disabled={isRecording}
      style={[styles.roundButton, { opacity: isRecording && 0 }]}
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
      {isRecording
        ? (
          <Animatable.View
            animation="bounceInDown"
            easing="ease-out"
            style={styles.recordingContainer}
          >
            <View style={{ textAlign: 'center' }}>
              <Headline
                type={4}
                isDense
                text={i18n.t('• Recording')}
                color={COLORS.error[900]}
              />
            </View>
          </Animatable.View>
        ) : (
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
        )}

    </View>
  );
  const FooterContainer = () => {
    const AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);
    return (
      <View>
        {!isRecording && (
        <View style={styles.countdown}>
          <Headline
            type={3}
            color={COLORS.shades[0]}
            text={moment.utc(timer * 1000).format('mm:ss')}
          />
        </View>
        )}

        <View style={[styles.recordUnit, { backgroundColor: isRecording ? 'transparent' : Utils.addAlpha(COLORS.shades[100], 0.4) }]}>
          {!isRecording && (
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
          )}
          <AnimatableTouchableOpacity
            onPress={handleCapture}
            onLongPress={startCaptureVideo}
            animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            activeOpacity={0.9}
            style={[styles.recordButton, { borderColor: isRecording ? COLORS.error[900] : COLORS.shades[0] }]}
          >
            <View
              style={{
                backgroundColor: isRecording ? COLORS.error[900] : COLORS.shades[0],
                height: 54,
                width: 54,
                borderRadius: RADIUS.xl,
              }}
            />
          </AnimatableTouchableOpacity>
          {!isRecording && (
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
          )}
        </View>
      </View>
    );
  };

  const ImagePreview = () => (
    <TouchableOpacity
      onPress={handleImageUpload}
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <ImageBackground
          // eslint-disable-next-line react/destructuring-assignment
        source={{ uri: capturedImage && capturedImage.uri }}
        style={{
          flex: 1,
        }}
      />
    </TouchableOpacity>
  );

  const VideoPreview = () => (
    <TouchableOpacity
      onPress={() => setCapturedVideo(null)}
      style={{
        backgroundColor: COLORS.shades[100],
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <Video
        source={{ uri: capturedVideo && capturedVideo.uri }} // Can be a URL or a local file.
        // ref={(ref) => {
        //   this.player = ref;
        // }} // Store reference
        // onBuffer={this.onBuffer} // Callback when remote video is buffering
        // onError={this.videoError} // Callback when video cannot be loaded
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          transform: [{ scaleX: -1 }],
        }}
      />
    </TouchableOpacity>
  );

  if (capturedImage) {
    return <ImagePreview />;
  }

  if (capturedVideo) {
    return <VideoPreview />;
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{ flex: 1 }}
      onPress={checkDoublePress}
    >
      <PinchGestureHandler onGestureEvent={(event) => changeZoom(event)}>
        <View style={styles.container}>
          <>
            <Camera
              style={{ flex: 1 }}
              flashMode={flashMode}
              zoom={zoom}
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

        </View>
      </PinchGestureHandler>
    </TouchableOpacity>
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
  recordingContainer: {
    alignSelf: 'center',
    height: 35,
    backgroundColor: Utils.addAlpha(COLORS.error[900], 0.1),
    borderWidth: 2,
    borderColor: COLORS.error[900],
    borderRadius: RADIUS.xl,
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
    borderColor: COLORS.shades[0],
    marginHorizontal: 24,
    height: 66,
    width: 66,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordUnit: {
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