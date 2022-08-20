import { View, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';

export default function Divider({
  vertical, top, bottom, color, style, omitPadding = false,
}) {
  const marginTop = omitPadding ? 0 : top || vertical || 10;
  const marginBottom = omitPadding ? 0 : bottom || vertical || 10;
  const borderTopColor = color || COLORS.neutral[100];

  return (
    <View style={[styles.divider, style, { marginTop, marginBottom, borderTopColor }]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 1,
  },
});
