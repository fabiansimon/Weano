import { View, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import moment from 'moment';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';
import Body from './typography/Body';
import Utils from '../utils';
import i18n from '../utils/i18n';

export default function RecapCardMini({ data, style, onPress }) {
  const {
    location, description, dateRange, title,
  // eslint-disable-next-line react/destructuring-assignment
  } = data;

  const getDaysContainer = (dates) => {
    const getDayDifference = () => {
      if (!dates) {
        return;
      }

      const toDate = moment(Utils.getDateFromTimestamp(dates.startDate));
      const fromDate = moment().startOf('day');

      const difference = Math.round(moment.duration(toDate.diff(fromDate)).asDays());
      return difference;
    };

    return (
      <View style={styles.daysContainer}>
        <Headline
          type={4}
          text={getDayDifference()}
          color={COLORS.neutral[500]}
          isDense
        />
        <Body
          type={2}
          text={i18n.t('days')}
          color={COLORS.neutral[500]}
        />
      </View>
    );
  };

  return (
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
          text={title}
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
      {getDaysContainer(dateRange || null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  daysContainer: {
    borderRadius: RADIUS.m,
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.neutral[50],

  },
});
