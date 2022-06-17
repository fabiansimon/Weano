import { View, StyleSheet } from 'react-native';
import React from 'react';
import moment from 'moment';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';
import i18n from '../utils/i18n';
import Utils from '../utils';

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
        type={2}
        text={getDayDifference()}
        color={COLORS.shades[0]}
        style={{ fontSize: 20, margin: -10 }}
      />
      <Headline
        type={4}
        text={i18n.t('days')}
        color={COLORS.shades[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 65,
    width: 55,
    backgroundColor: COLORS.secondary[700],
  },
});
