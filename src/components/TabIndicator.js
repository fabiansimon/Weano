import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';
import Body from './typography/Body';

export default function TabIndicator({
  style, text, isActive, onPress,
}) {
  const backgroundColor = isActive ? COLORS.primary[700] : 'transparent';
  const color = isActive ? COLORS.shades[0] : COLORS.neutral[300];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, style, { backgroundColor }]}
      onPress={onPress}
    >
      <Body type={1} text={text} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    borderRadius: 100,
    paddingHorizontal: 12,
  },
});
