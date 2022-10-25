import {
  StyleSheet, Image, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';
import DefaultAvatar from '../../assets/images/default_avatar.png';
import Headline from './typography/Headline';

export default function Avatar({
  style, size, uri, onPress, backgroundColor, text, borderWidth, disabled,
}) {
  const height = size || 55;
  const width = size || 55;
  const bg = backgroundColor || text ? COLORS.secondary[700] : COLORS.shades[0];
  const bW = borderWidth || 1;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, style, {
        height, width, backgroundColor: bg, borderWidth: bW,
      }]}
      onPress={onPress}
    >
      {!text && (
        <Image
          source={DefaultAvatar}
          style={{ height, width, position: 'absolute' }}
        />
      )}
      {!text && (
        <Image
          source={{ uri }}
          style={{ height, width }}
        />
      )}
      {text && (
        <Headline
          type={4}
          text={text}
          color={COLORS.shades[0]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.shades[0],
  },
});
