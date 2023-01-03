import { StyleSheet, Pressable } from 'react-native';
import React from 'react';
import COLORS, { RADIUS } from '../../constants/Theme';

export default function TripListContainer({
  style, children, onLayout, onPress, ...rest
}) {
  return (
    <Pressable
      onPress={onPress}
      {...rest}
      onLayout={onLayout}
      style={[styles.container, style]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    paddingVertical: 15,
  },
});
