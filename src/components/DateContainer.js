import { View, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';
import Utils from '../utils';

export default function DateContainer({ style, dates }) {
  // `MMM Do ${suffix ? 'YY' : ''}`

  const getDayString = () => {
    const startDate = Utils.getDateFromTimestamp(dates.startDate, 'Do');
    const endDate = Utils.getDateFromTimestamp(dates.endDate, 'Do');

    return `${startDate} - ${endDate}`;
  };

  const getYearString = () => {
    const startMonth = Utils.getDateFromTimestamp(dates.startDate, 'MMMM').toUpperCase();
    const endMonth = Utils.getDateFromTimestamp(dates.endDate, 'MMMM').toUpperCase();

    const startYear = Utils.getDateFromTimestamp(dates.startDate, 'YYYY').toUpperCase();
    const endYear = Utils.getDateFromTimestamp(dates.endDate, 'YYYY').toUpperCase();
    return `${startMonth} ${startMonth !== endMonth ? `- ${endMonth}` : ''} ${startYear} ${startYear !== endYear ? `- ${endYear}` : ''}`;
  };

  return (
    <View style={[styles.container, style]}>
      <Headline type={3} text={getDayString()} color={COLORS.neutral[900]} />
      <Headline type={3} text={getYearString()} style={{ fontSize: 14, fontWeight: '600', marginTop: -8 }} color={COLORS.neutral[900]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.shades[0],
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
