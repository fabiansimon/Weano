import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Headline from '../typography/Headline';
import Subtitle from '../typography/Subtitle';
import COLORS from '../../constants/Theme';

export default function PollTile({
  style, data, onPress, isActive,
}) {
  const getPercentage = (votes) => (votes / 10) * 100;
  const activeColor = isActive && COLORS.primary[700];

  return (
    <TouchableOpacity
      style={[styles.tile, style, { borderColor: activeColor || COLORS.neutral[100] }]}
      activeOpacity={0.6}
      onPress={onPress}
    >
      <View style={styles.infoHeader}>
        <View>
          <Headline
            type={3}
            text={data.title}
            color={activeColor || COLORS.shades[100]}
            style={{ marginTop: -4 }}
          />
          <Subtitle
            type={2}
            text={data.subtitle}
            color={activeColor || COLORS.neutral[300]}
          />
        </View>
        <Headline
          type={4}
          text={`${getPercentage(data.votes)}%`}
          color={activeColor || COLORS.shades[100]}
        />
      </View>
      <View style={styles.barOutline}>
        <View style={[styles.progressBar, {
          width: `${getPercentage(data.votes)}%`,
          backgroundColor: activeColor || COLORS.neutral[100],
        }]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  barOutline: {
    height: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    width: '100%',
  },
  infoHeader: {
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  progressBar: {
    backgroundColor: 'red',
    height: 10,
    borderRadius: 100,
  },
  tile: {
    backgroundColor: COLORS.shades[0],
    padding: 10,
    justifyContent: 'space-between',
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    alignItems: 'center',
    borderWidth: 1,
  },
});
