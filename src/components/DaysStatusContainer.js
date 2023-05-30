import {StyleSheet, View} from 'react-native';
import React from 'react';
import Subtitle from './typography/Subtitle';
import Utils from '../utils';
import COLORS, {RADIUS} from '../constants/Theme';
import i18n from '../utils/i18n';
import moment from 'moment';

export default function DaysStatusContainer({data, style}) {
  const {dateRange, type} = data;

  const isRecent = type === 'recent';
  const isActive = type === 'active';

  const getDayDifference = dates => {
    if (!dates) {
      return;
    }

    const toDate = moment(Utils.getDateFromTimestamp(dates.startDate / 1000));

    const difference = Utils.getDaysDifference(toDate);
    return difference;
  };
  const daysDifference = getDayDifference(dateRange);

  const color = isRecent
    ? COLORS.primary
    : isActive
    ? COLORS.error
    : COLORS.success;

  const getDayString = () => {
    if (isActive) {
      return i18n.t('Active');
    }

    if (isRecent) {
      return `${Math.abs(daysDifference)} ${i18n.t('days ago')}`;
    }
    return `${i18n.t('in')} ${daysDifference} ${
      daysDifference === 1 ? i18n.t('day') : i18n.t('days')
    }`;
  };
  return (
    <View
      style={[
        style,
        styles.daysContainer,
        {
          backgroundColor: Utils.addAlpha(color[700], 0.2),
        },
      ]}>
      <Subtitle
        type={1}
        text={getDayString()}
        color={color[isRecent ? 700 : 900]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  daysContainer: {
    borderRadius: RADIUS.xl,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
});
