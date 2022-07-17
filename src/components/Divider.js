import { View, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';

export default function Divider({
  vertical, top, bottom, color, style,
}) {
  const marginTop = top || vertical || 10;
  const marginBottom = bottom || vertical || 10;
  const borderTopColor = color || COLORS.neutral[100];

  return (
    <View style={[styles.divider, style, { marginTop, marginBottom, borderTopColor }]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    borderTopWidth: 1,
  },
});
