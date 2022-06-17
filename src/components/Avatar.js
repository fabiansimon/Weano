import {
  StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';
import DefaultAvatar from '../../assets/images/default_avatar.png';

export default function Avatar({
  style, size, uri, onPress,
}) {
  const height = size || 55;
  const width = size || 55;

  return (
    <TouchableOpacity style={[styles.container, style, { height, width }]} onPress={onPress}>
      <Image source={DefaultAvatar} style={{ height, width, position: 'absolute' }} />
      <Image source={{ uri }} style={{ height, width }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.shades[0],
  },
});
