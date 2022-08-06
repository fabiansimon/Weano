import { View, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';

export default function TripListContainer({ style, children }) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    paddingVertical: 15,
  },
});
