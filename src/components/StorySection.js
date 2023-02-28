import {
  Pressable,
  ScrollView, StyleSheet, View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../constants/Theme';
import Body from './typography/Body';
import i18n from '../utils/i18n';
import ROUTES from '../constants/Routes';
import Utils from '../utils';
import Label from './typography/Label';
import DefaultImage from '../../assets/images/default_trip.png';
import Headline from './typography/Headline';

export default function StorySection({
  style, contentContainerStyle, data,
}) {
  const navigation = useNavigation();

  const getTripContainer = (trip) => {
    const {
      location, thumbnailUri: uri, id: tripId, dateRange,
    } = trip;
    const type = Utils.convertDateToType(dateRange);
    if (type === 'upcoming' || type === 'soon') {
      return;
    }
    const borderColor = type === 'active' ? COLORS.error[700] : COLORS.primary[500];

    return (
      <Pressable
        style={{ width: 68, marginRight: 14 }}
        onPress={() => navigation.navigate(ROUTES.memoriesScreen, { tripId, initShowStory: true })}
      >
        <View style={[styles.outerTripContainer, { borderColor }]}>
          <FastImage
            style={styles.tripContainer}
            source={uri ? { uri } : DefaultImage}
          />
        </View>
        <Body
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ marginTop: 6, marginBottom: -2, textAlign: 'center' }}
          type={2}
          text={location.placeName.split(',')[0]}
        />
        <Label
          style={{ textAlign: 'center' }}
          type={1}
          color={COLORS.neutral[300]}
          text={Utils.getDateFromTimestamp(dateRange.startDate, 'YYYY')}
        />
      </Pressable>
    );
  };
  return (
    <View style={style}>
      <ScrollView
        horizontal
        contentContainerStyle={contentContainerStyle}
      >
        <Pressable
          onPress={() => navigation.navigate(ROUTES.mapScreen)}
          style={{ marginRight: 14 }}
        >
          <View style={styles.mapButton}>
            <Headline type={1} text="🌍" />
          </View>
          <Body
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ marginTop: 6, marginBottom: -2, textAlign: 'center' }}
            type={2}
            text={i18n.t('See Map')}
          />
          <Label
            style={{ textAlign: 'center' }}
            type={1}
            color={COLORS.neutral[300]}
            text={`${data.length} ${i18n.t('Trips')}`}
          />
        </Pressable>
        {data.map((trip) => getTripContainer(trip))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tripContainer: {
    height: 62,
    width: 62,
    borderRadius: 20,
    backgroundColor: COLORS.shades[0],
  },
  outerTripContainer: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 1.5,
  },
  mapButton: {
    height: 68,
    width: 68,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
