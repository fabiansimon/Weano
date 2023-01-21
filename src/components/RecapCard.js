import {
  View, StyleSheet, Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import React, { useEffect, useRef, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';
import DaysContainer from './DaysContainer';
import Body from './typography/Body';
import Utils from '../utils';
import i18n from '../utils/i18n';

export default function RecapCard({
  data, style, type = 'main', onPress,
}) {
  const [totalImages, setTotalImages] = useState();
  const [imageIndex, setImageIndex] = useState(0);
  let timerRef = useRef();

  const {
    location, description, dateRange, title, thumbnailUri, images,
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
    timerRef = setInterval(() => {
      // eslint-disable-next-line no-param-reassign
      setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev += 1));
      // console.log('called');
    }, ROTATION_TIMER_SECONDS * 1000);

    return () => {
      clearInterval(timerRef);
    };
  }, []);

  const getDateString = () => `${Utils.getDateFromTimestamp(data.dateRange.startDate, 'MMMM YYYY')}`;

  const getMiniCard = () => (
    <Pressable
      style={[styles.miniContainer, styles.boxShadow, style]}
      onPress={onPress}
    >
      <View style={{
        justifyContent: 'center', padding: 6, paddingTop: 2, flex: 1, marginRight: 26,
      }}
      >
        <Headline
          isDense
          type={4}
          text={data?.title}
          numberOfLines={1}
        />
        <Body
          type={2}
          numberOfLines={1}
          text={`${description || location?.placeName || Utils.getDateFromTimestamp(dateRange?.startDate, 'MM YYYY')}`}
          color={COLORS.neutral[300]}
          isDense
        />
      </View>
      <DaysContainer dates={data?.dateRange} />
    </Pressable>
  );

  const getMainCard = () => (
    <Pressable
      onPress={onPress}
      style={styles.mainCard}
    >
      <FastImage
        source={{ uri: totalImages ? totalImages[imageIndex].uri : thumbnailUri }}
        resizeMode="contain"
        style={{
          weight: '100%',
          height: '100%',
          backgroundColor: COLORS.neutral[900],
        }}
      />
      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={5}
        reducedTransparencyFallbackColor={COLORS.shades[0]}
      />
      <View style={styles.infoContainer}>
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
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
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
              style={{ marginRight: 4 }}
              text={location?.placeName.split(', ')[0]}
            />
          </View>
          <View style={styles.infoTile}>
            <Icon
              name="calendar"
              color={COLORS.shades[0]}
              size={16}
              style={{ marginRight: 4 }}
            />
            <Body
              type={2}
              style={{ marginRight: 4 }}
              color={COLORS.shades[0]}
              text={getDateString()}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    type === 'mini' ? getMiniCard() : getMainCard()
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
    height: '30%',
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
    borderRadius: RADIUS.l,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 35,
    marginRight: 6,
    backgroundColor: Utils.addAlpha(COLORS.neutral[50], 0.2),
  },
});
