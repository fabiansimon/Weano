import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';

export default function PollTile({
  style, data, onPress, isActive,
}) {
  const getPercentage = (votes) => (votes / 10) * 100;
  const activeColor = isActive && COLORS.primary[700];

  return (
    <TouchableOpacity
      style={[styles.tile, style, { borderColor: activeColor || COLORS.neutral[100] }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={[styles.progressBar,
        {
          width: `${getPercentage(data.votes)}%`,

          backgroundColor: activeColor || COLORS.neutral[100],
        }]}
      />
      <View style={styles.container}>
        <Headline
          type={4}
          text={data.title}
          color={isActive ? COLORS.shades[0] : COLORS.shades[100]}
        />
        <Headline
          type={4}
          text={`${getPercentage(data.votes)}%`}
          color={activeColor || COLORS.shades[100]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  progressBar: {
    zIndex: 0,
    height: '100%',
    left: 0,
    top: 0,
    position: 'absolute',
    borderRadius: 12,
  },
  tile: {
    zIndex: 2,
    backgroundColor: COLORS.shades[0],
    justifyContent: 'space-between',
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    height: 55,
    alignItems: 'center',
    borderWidth: 1,
  },
});
