import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function InfoCircle({
  style, title, subtitle, onPress, disableShadow = false,
}) {
  const shadowStyle = disableShadow ? {} : {
    shadowColor: COLORS.shades[100],
    shadowRadius: 10,
    shadowOpacity: 0.05,
  };

  return (
    <TouchableOpacity style={[styles.container, style, shadowStyle]} onPress={onPress}>
      <Headline type={3} text={title} />
      <Headline type={3} text={subtitle} style={{ marginTop: -6 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: COLORS.shades[0],
  },
});
