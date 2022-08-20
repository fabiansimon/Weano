import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import Subtitle from '../typography/Subtitle';
import Utils from '../../utils';
import i18n from '../../utils/i18n';

export default function DateRangeContainer({
  style, dateRange, onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={[styles.container, style]}
    >
      <View>
        <Headline
          type={3}
          style={{ marginBottom: -4, marginTop: -4 }}
          text={Utils.getDateFromTimestamp(dateRange.startDate, 'DD.MM')}
        />
        <Headline
          type={3}
          text={Utils.getDateFromTimestamp(dateRange.endDate, 'DD.MM')}
        />
      </View>
      <View>
        <Subtitle
          type={1}
          text="7 out of 8"
          style={{ marginBottom: -2 }}
          isDense
        />
        <Subtitle
          type={2}
          text={i18n.t('available')}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 110,
    width: 110,
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
  },
});
