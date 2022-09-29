import {
  Image, StyleSheet, View,
} from 'react-native';
import React from 'react';
import { RADIUS } from '../../constants/Theme';

export default function ImageContainer({ style, uri }) {
  return (
    <View style={[styles.container, style]}>
      <Image uri={uri} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    backgroundColor: 'red',
    borderRadius: RADIUS.m,
  },
});
