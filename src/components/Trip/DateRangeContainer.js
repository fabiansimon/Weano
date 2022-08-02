import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import Subtitle from '../typography/Subtitle';
import Divider from '../Divider';
import Utils from '../../utils';

export default function DateRangeContainer({
  style, dateRange, title, subtitle, isActive = true, onPress,
}) {
  const color = isActive ? COLORS.primary[700] : COLORS.shades[100];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={[isActive ? styles.activeContainer : styles.inactiveContainer, style]}
    >
      <View style={{ paddingTop: 6, alignItems: 'center' }}>
        <Headline
          type={3}
          color={color}
          text={Utils.getDateFromTimestamp(dateRange.startDate, 'MMM Do')}
        />
        <Headline
          type={3}
          color={color}
          text={Utils.getDateFromTimestamp(dateRange.endDate, 'MMM Do')}
        />
      </View>
      <Divider
        color={isActive ? COLORS.primary[700] : COLORS.neutral[100]}
      />
      <View style={styles.bottomContainer}>
        <Headline
          type={2}
          text={title}
          color={color}
          style={{ marginBottom: -6 }}
          isDense
        />
        <Subtitle
          type={1}
          color={color}
          text={subtitle}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inactiveContainer: {
    alignItems: 'center',
    borderRadius: 14,
    width: 95,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
  },
  activeContainer: {
    alignItems: 'center',
    borderRadius: 14,
    width: 95,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.primary[700],
    borderWidth: 1,
    shadowColor: COLORS.primary[300],
    shadowRadius: 4,
    shadowOpacity: 0.05,
  },
  bottomContainer: {
    paddingTop: 6,
    alignItems: 'center',
    marginTop: -10,
    paddingBottom: 10,
  },
});
