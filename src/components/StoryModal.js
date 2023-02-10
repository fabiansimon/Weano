import {
  Modal,
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring,
} from 'react-native-reanimated';
import RNFetchBlob from 'rn-fetch-blob';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import BackButton from './BackButton';
import Utils from '../utils';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import Avatar from './Avatar';
import toastConfig from '../constants/ToastConfig';

export default function StoryModal({
  data, isVisible, onRequestClose, initalIndex = 0,
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height } = Dimensions.get('window');

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const animatedBorderRadius = useSharedValue(0);

  useEffect(() => {
    setImageIndex(initalIndex);
  }, [initalIndex]);

  const handleClose = (value) => {
    if (value < 0.7) {
      onRequestClose();

      translateY.value = 0;
      translateX.value = 0;
      animatedBorderRadius.value = 0;
      scale.value = 1;
    }
  };

  const handleGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      const { translationY, translationX } = event;

      const borderRadius = translationY / 15;

      translateY.value = translationY;
      translateX.value = translationX;
      animatedBorderRadius.value = borderRadius > 20 ? 20 : borderRadius;
      scale.value = Math.abs((translationY - height) / height);
    },
    onEnd: () => {
      const springConfig = {
        mass: 0.5,
      };

      translateY.value = withSpring(0, springConfig);
      translateX.value = withSpring(0, springConfig);
      animatedBorderRadius.value = withSpring(0, springConfig);
      scale.value = withSpring(1, springConfig);
    },
  });

  useDerivedValue(() => {
    runOnJS(handleClose)(scale.value);
  });

  const modalStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: animatedBorderRadius.value,
    borderTopRightRadius: animatedBorderRadius.value,
    borderBottomLeftRadius: animatedBorderRadius.value,
    borderBottomRightRadius: animatedBorderRadius.value,
    transform: [{
      translateY: translateY.value,
    }, {
      translateX: translateX.value,
    }, {
      scale: scale.value,
    }],
  }));
  const handleDownload = async () => {
    setIsLoading(true);
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
    }).fetch('GET', data[imageIndex].uri).then((res) => {
      Utils.downloadImage(res.data);
      setIsLoading(false);
    }).catch((e) => {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: e.message,
      });
      setIsLoading(false);
    });
  };

  const ProgressHeader = () => (
    <View style={{
      position: 'absolute',
      top: 50,
    }}
    >
      <View style={styles.progressBar}>
        {data.map((_, index) => (
          <View style={{
            height: 3, flex: 1, backgroundColor: index <= imageIndex ? COLORS.shades[0] : Utils.addAlpha('#ffffff', 0.1), marginLeft: index !== 0 ? 4 : 0, borderRadius: 10,
          }}
          />
        ))}
      </View>
      <View style={styles.buttonRow}>
        <BackButton
          isClear
          onPress={onRequestClose}
          iconColor={COLORS.shades[0]}
        />
        <Pressable
          onPress={handleDownload}
          disabled={isLoading}
          activeOpacity={0.8}
          style={[styles.roundButton, { marginLeft: 10 }]}
        >
          {isLoading ? <ActivityIndicator color={COLORS.shades[0]} />
            : (
              <Icon
                name="download"
                size={20}
                color={Utils.addAlpha(COLORS.neutral[50], 0.9)}
                style={{ marginRight: -2 }}
              />
            )}
        </Pressable>
      </View>
    </View>
  );

  const ImagePreview = ({ item }) => {
    const {
      uri, title, description, author, createdAt,
    } = item;

    return (
      <View style={{ width, height, backgroundColor: COLORS.neutral[900] }}>
        <FastImage
          source={{ uri }}
          style={{
            width,
            height: Dimensions.get('window').height,
          }}
        />
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={4}
          reducedTransparencyFallbackColor={COLORS.shades[0]}
        />
        <View style={styles.infoContainer}>
          <View>
            <Body
              type={1}
              color={COLORS.shades[0]}
              style={{ fontStyle: !title ? 'italic' : 'normal' }}
              text={title || i18n.t('No title')}
            />
            <Body
              type={2}
              color={Utils.addAlpha('#ffffff', 0.5)}
              style={{ fontStyle: !description ? 'italic' : 'normal' }}
              text={description || i18n.t('No description')}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Body
                type={1}
                style={{ textAlign: 'right' }}
                color={COLORS.shades[0]}
                text={`${author?.firstName || ''} ${author?.lastName || i18n.t('Deleted user')}`}
              />
              <Body
                type={2}
                style={{ textAlign: 'right' }}
                color={Utils.addAlpha('#ffffff', 0.5)}
                text={`${Utils.getDateFromTimestamp(createdAt / 1000, 'MMM Do YYYY')}`}
              />
            </View>
            <Avatar
              style={{ marginLeft: 10 }}
              disabled
              size={30}
              data={author}
            />
          </View>
        </View>
        <View style={{
          position: 'absolute', height: '100%', width, flexDirection: 'row',
        }}
        >
          <Pressable
            onPress={() => setImageIndex((index) => (index !== 0 ? index - 1 : 0))}
            style={{
              flex: 1,
            }}
          />
          <Pressable
            onPress={() => setImageIndex((index) => (index !== data.length - 1 ? index + 1 : data.length - 1))}
            style={{
              flex: 1,
            }}
          />
        </View>

      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="overFullScreen"
      visible={isVisible}
      useNativeDriver
      collapsable
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View style={[{
          overflow: 'hidden',
          flex: 1,
          backgroundColor: COLORS.neutral[900],
        }, modalStyle]}
        >
          <ImagePreview item={data[imageIndex]} />
          <ProgressHeader />
        </Animated.View>
      </PanGestureHandler>
      <Toast config={toastConfig} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    paddingHorizontal: PADDING.m,
  },
  roundButton: {
    borderRadius: RADIUS.xl,
    borderWidth: 0.5,
    borderColor: Utils.addAlpha(COLORS.neutral[50], 0.3),
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shades[100],
    shadowRadius: 30,
    shadowOpacity: 0.3,
    backgroundColor: Utils.addAlpha(COLORS.neutral[50], 0.15),
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.m,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.l,
    paddingBottom: 50,
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: 0,
  },
  blurView: {
    position: 'absolute',
    width: '100%',
    height: '13%',
    bottom: 0,
  },
});
