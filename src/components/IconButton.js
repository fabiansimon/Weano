import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS, {RADIUS} from '../constants/Theme';

export default function IconButton({style, icon, isActive = true, onPress}) {
  const color = isActive ? COLORS.secondary[700] : COLORS.neutral[100];

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Icon name={icon} color={color} size={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    borderColor: COLORS.neutral[100],
    height: 45,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
  },
});
