import { View, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';

export default function Divider({ vertical, top, bottom }) {
  const marginTop = top || vertical || 10;
  const marginBottom = bottom || vertical || 10;

  return (
    <View style={[styles.divider, { marginTop, marginBottom }]} />
  );
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    borderTopColor: COLORS.neutral[100],
    borderTopWidth: 1,
  },
});
