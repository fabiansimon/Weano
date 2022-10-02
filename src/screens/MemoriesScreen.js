/* eslint-disable no-return-assign */
/* eslint-disable react/no-unstable-nested-components */
import {
  FlatList, Share, StyleSheet, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import React, { useEffect } from 'react';
import { PinchGestureHandler, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from '../components/typography/Headline';
import i18n from '../utils/i18n';
import Subtitle from '../components/typography/Subtitle';
import ImageContainer from '../components/Trip/ImageContainer';

export default function MemoriesScreen() {
  const scale = useSharedValue(1);
  const headerOpacity = useSharedValue(1);

  const images = [];
  const imagesLength = 9;
  const numColumns = Math.sqrt(imagesLength);

  useEffect(() => {
    for (let i = 0; i < imagesLength; i += 1) {
      images.push('https://picsum.photos/160/290');
    }
  }, []);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
      headerOpacity.value = withSpring(0);
    },
    onEnd: () => {
      scale.value = withTiming(1);
      headerOpacity.value = withSpring(1);
    },
  });

  const gAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const hAnimated = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
              'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getHeader = () => (
    <Animated.View style={[styles.header, hAnimated]}>
      <TouchableOpacity style={styles.roundButton}>
        <Icon
          name="arrowleft"
          color={COLORS.neutral[300]}
          size={22}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row' }}>
        <Headline
          type={1}
          style={{ fontWeight: '500', marginTop: -2 }}
          color={COLORS.shades[0]}
          text="23"
        />
        <View style={{ marginLeft: 12 }}>
          <Headline
            type={4}
            color={COLORS.shades[0]}
            text={i18n.t('Moments captured')}
          />
          <Subtitle
            type={2}
            color={COLORS.shades[0]}
            style={{ opacity: 0.5 }}
            text="3 POV’s • 36 Photos • 7 Videos"
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={onShare}
        style={styles.roundButton}
      >
        <Icon
          style={{ marginLeft: -2 }}
          name="sharealt"
          color={COLORS.neutral[300]}
          size={18}
        />
      </TouchableOpacity>
    </Animated.View>
  );

  const getImageTile = (uri, index) => {
    const isLeft = index === 0 || index % numColumns === 0;
    return (
      <ImageContainer
        style={[{ marginLeft: isLeft ? 0 : 40, marginTop: 40 }]}
        uri={uri}
      />
    );
  };

  const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <AnimatedFlatlist
          style={gAnimated}
          // onScroll={(e) => console.log(e.nativeEvent.contentSize)}
          onScrollBeginDrag={() => headerOpacity.value = withSpring(0)}
          onScrollEndDrag={() => headerOpacity.value = withSpring(1)}
          data={images}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 60 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => getImageTile(item, index)}
        />
      </PinchGestureHandler>
      {getHeader()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    top: 50,
    position: 'absolute',
    width: '98%',
    alignSelf: 'center',
    height: 55,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[900],
    marginHorizontal: PADDING.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.s,
  },
  roundButton: {
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    backgroundColor: COLORS.shades[100],
  },
});
