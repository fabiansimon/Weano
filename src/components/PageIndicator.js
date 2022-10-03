import { View, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';

export default function PageIndicator({ data, pageIndex, style }) {
  const getBubble = (index) => {
    const opacity = pageIndex !== index ? 0.3 : 1;
    const width = pageIndex === index ? 32 : 8;
    const marginRight = index === data.length - 1 ? 0 : 10;

    return (
      <View
        style={[styles.bubble, { width, opacity, marginRight }]}
        key={index}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {data.map((_, index) => getBubble(index))}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    height: 8,
    borderRadius: 100,
    backgroundColor: COLORS.primary[700],
  },
  container: {
    flexDirection: 'row',
  },
});
