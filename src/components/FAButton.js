import {
  StyleSheet, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';

export default function FAButton({
  style, onPress, icon, iconSize = 22,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.fab, style]}
      onPress={onPress}
    >
      <Icon
        name={icon}
        color={COLORS.shades[0]}
        size={iconSize}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 50,
    right: PADDING.xl,
    height: 55,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    shadowColor: COLORS.neutral[500],
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: {},
  },
});
