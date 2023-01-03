import {
  StyleSheet, TouchableOpacity,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { RADIUS } from '../../constants/Theme';

export default function ImageContainer({
  style, uri, onLoadEnd, onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={[styles.container, style]}
    >
      <FastImage
        onLoadEnd={onLoadEnd}
        source={{ uri }}
        resizeMode="cover"
        style={styles.image}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    aspectRatio: 9 / 16,
    borderRadius: RADIUS.m,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
});
