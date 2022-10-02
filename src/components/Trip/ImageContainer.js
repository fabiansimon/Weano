import {
  Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import React from 'react';
import { RADIUS } from '../../constants/Theme';

export default function ImageContainer({ style, uri }) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.container, style]}
    >
      <Image
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
