import { StyleSheet } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import Subtitle from '../typography/Subtitle';
import i18n from '../../utils/i18n';
import Utils from '../../utils';

export default function AvailabilityCard({ style, dateRange }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <Headline type={4} text={Utils.getDateFromTimestamp(dateRange.startDate, 'DD.MM')} />
      <Subtitle type={2} text={i18n.t('to')} />
      <Headline type={4} text={Utils.getDateFromTimestamp(dateRange.endDate, 'DD.MM')} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});
