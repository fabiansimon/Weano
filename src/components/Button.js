import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function Button({
  style, text, onPress, isDisabled,
}) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} disabled={isDisabled}>
      <Headline type={4} text={text} color={COLORS.shades[0]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: COLORS.primary[700],
  },
});
