import { View, StyleSheet } from 'react-native';
import React from 'react';
import moment from 'moment';
import COLORS, { RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';
import i18n from '../utils/i18n';
import Utils from '../utils';
import Body from './typography/Body';

export default function DaysContainer({ style, dates }) {
  const getDayDifference = () => {
    const toDate = moment(Utils.getDateFromTimestamp(dates.startDate));
    const fromDate = moment().startOf('day');

    const difference = Math.round(moment.duration(toDate.diff(fromDate)).asDays());
    return difference;
  };

  return (
    <View style={[styles.container, style]}>
      <Headline
        type={3}
        text={getDayDifference()}
        color={COLORS.shades[0]}
        isDense
        style={{ marginBottom: -4 }}
      />
      <Body
        type={1}
        isDense
        text={i18n.t('days')}
        color={COLORS.shades[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.m,
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    backgroundColor: COLORS.secondary[700],
  },
});
