import {
  View, StyleSheet, Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import React, { useEffect, useRef, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';
import Body from './typography/Body';
import Utils from '../utils';
import i18n from '../utils/i18n';

export default function RecapCard({
  data, style, onPress,
}) {
  // STATE & MISC
  const [totalImages, setTotalImages] = useState();
  const [imageIndex, setImageIndex] = useState(0);
  const [infoHeight, setInfoHeight] = useState(0);
  let timerRef = useRef();

  const {
    location, description, title, thumbnailUri, images,
  } = data;

  const ROTATION_TIMER_SECONDS = 5;

  useEffect(() => {
    if (thumbnailUri !== '') {
      setTotalImages([{ uri: thumbnailUri }, ...images]);
    } else {
      setTotalImages(images);
    }
  }, [images]);

  useEffect(() => {
    if (images.length <= 0) {
      return;
    }
    timerRef = setInterval(() => {
      // eslint-disable-next-line no-param-reassign, no-constant-condition
      setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev += 1));
      // console.log('called');
    }, ROTATION_TIMER_SECONDS * 1000);

    return () => {
      clearInterval(timerRef);
    };
  }, []);

  const getDateString = () => `${Utils.getDateFromTimestamp(data.dateRange.startDate, 'MMMM YYYY')}`;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.mainCard, style]}
    >
      <FastImage
        source={{ uri: totalImages ? totalImages[imageIndex]?.uri : thumbnailUri }}
        resizeMode="contain"
        style={{
          weight: '100%',
          height: '100%',
          backgroundColor: COLORS.neutral[900],
        }}
      />
      <View style={[styles.infoTile, { position: 'absolute', right: 10, top: 6 }]}>
        <Icon
          name="calendar"
          color={COLORS.shades[0]}
          size={16}
          style={{ marginRight: 4 }}
        />
        <Body
          type={2}
          color={COLORS.shades[0]}
          text={getDateString()}
        />
      </View>
      <BlurView
        style={[styles.blurView, { height: infoHeight + 15 }]}
        blurType="light"
        blurAmount={5}
        reducedTransparencyFallbackColor={COLORS.shades[0]}
      />
      <View
        onLayout={(e) => setInfoHeight(e.nativeEvent.layout.height)}
        style={styles.infoContainer}
      >
        <Headline
          style={{ marginLeft: 2 }}
          type={3}
          text={title}
          color={COLORS.shades[0]}
        />
        <Body
          type={2}
          style={{ marginLeft: 2 }}
          color={COLORS.shades[0]}
          text={description || i18n.t('No description')}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <View style={styles.infoTile}>
            <Icon
              name="location-pin"
              color={COLORS.shades[0]}
              size={18}
              style={{ marginRight: 4 }}
            />
            <Body
              type={2}
              color={COLORS.shades[0]}
              text={location?.placeName.split(', ')[0]}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mainCard: {
    borderWidth: 4,
    borderColor: COLORS.shades[0],
    aspectRatio: 3 / 4,
    height: 370,
    backgroundColor: COLORS.neutral[100],
    borderRadius: RADIUS.l,
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: COLORS.shades[0],
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    aspectRatio: 3.7,
    height: 75,
    padding: PADDING.s,
  },
  blurView: {
    position: 'absolute',
    width: '96%',
    borderRadius: RADIUS.m,
    alignSelf: 'center',
    bottom: 6,
  },
  infoContainer: {
    position: 'absolute',
    bottom: PADDING.m,
    width: '50%',
    marginLeft: PADDING.m,
    flexWrap: 'wrap',
  },
  infoTile: {
    marginTop: 8,
    borderRadius: RADIUS.l,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 35,
    backgroundColor: Utils.addAlpha(COLORS.neutral[50], 0.2),
  },
});
