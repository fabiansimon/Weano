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
import OctiIcon from 'react-native-vector-icons/Octicons';
import FastImage from 'react-native-fast-image';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring,
} from 'react-native-reanimated';
import RNFetchBlob from 'rn-fetch-blob';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
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
  // STATE & MISC
  const [imageIndex, setImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const animatedBorderRadius = useSharedValue(0);

  const { width, height } = Dimensions.get('window');

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

  const getProgressHeader = () => (
    <View style={{
      position: 'absolute',
      top: 50,
    }}
    >
      <View style={styles.progressBar}>
        {data.map((_, index) => (
          <View style={{
            height: 3, flex: 1, backgroundColor: index <= imageIndex ? COLORS.shades[0] : Utils.addAlpha('#ffffff', 0.1), marginLeft: index !== 0 ? 3 : 0, borderRadius: 10,
          }}
          />
        ))}
      </View>
      <View style={styles.buttonRow}>
        <BackButton
          closeIcon
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
          {isLoading ? <ActivityIndicator size={14} style={{ padding: 4 }} color={COLORS.shades[100]} /> : (
            <>
              <Body
                type={1}
                text={i18n.t('Save')}
                color={COLORS.neutral[700]}
                style={{ marginRight: 6 }}
              />

              <OctiIcon
                name="download"
                size={16}
                color={COLORS.neutral[700]}
              />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );

  const getImagePreview = (item) => {
    if (!item) {
      return;
    }

    const {
      uri, title, description, author, createdAt,
    } = item;

    return (
      <View style={{ width, height, backgroundColor: COLORS.shades[100] }}>
        <FastImage
          source={{ uri }}
          style={{
            borderRadius: RADIUS.m,
            flex: 1,
          }}
        />
        <View style={styles.infoContainer}>
          <View style={{ flex: 1 }}>
            <Body
              type={1}
              color={COLORS.shades[0]}
              style={{ fontStyle: !title ? 'italic' : 'normal' }}
              text={title || i18n.t('No title')}
            />
            <Body
              type={2}
              numberOfLines={2}
              ellipsizeMode="tail"
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
                text={`${author?.firstName || i18n.t('Deleted user')}`}
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
            onLongPress={() => {
              setImageIndex(0);
              ReactNativeHapticFeedback.trigger('impactLight');
            }}
            style={{
              flex: 1,
            }}
          />
          <Pressable
            onPress={() => setImageIndex((index) => (index !== data.length - 1 ? index + 1 : data.length - 1))}
            onLongPress={() => {
              setImageIndex(data.length - 1);
              ReactNativeHapticFeedback.trigger('impactLight');
            }}
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
          {data && getImagePreview(data[imageIndex])}
          {data && getProgressHeader()}
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
    flexDirection: 'row',
    borderRadius: RADIUS.xl,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shades[100],
    shadowRadius: 30,
    shadowOpacity: 0.3,
    backgroundColor: COLORS.shades[0],
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
    alignItems: 'flex-end',
    paddingHorizontal: PADDING.l,
    paddingBottom: 50,
    width: Dimensions.get('window').width,
    backgroundColor: COLORS.shades[100],
    paddingTop: 16,
    bottom: 0,
  },
});
