import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../constants/Theme';

export default function IconButton({
  style, icon, isActive, onPress,
}) {
  const color = isActive ? COLORS.secondary[900] : COLORS.neutral[300];

  return (
    <TouchableOpacity style={[styles.container, style, { borderColor: color }]} onPress={onPress}>
      <Icon name={icon} color={color} size={22} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: COLORS.shades[100],
    shadowRadius: 10,
    backgroundColor: COLORS.shades[0],
    shadowOpacity: 0.03,
  },
});
