import { StyleSheet, View } from 'react-native';
import React from 'react';
import Subtitle from './typography/Subtitle';
import COLORS from '../constants/Theme';

export default function TagContainer({ text, color }) {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Subtitle
        type={1}
        text={text}
        color={COLORS.shades[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },
});
