import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';

export default function RecapCard({ data, style }) {
  return (
    <TouchableOpacity style={[styles.container, style]}>
      <Image style={{ flex: 3, backgroundColor: COLORS.primary[300] }} source={{ uri: data.images[0] }} />
      <View style={styles.secondRow}>
        <Image style={{ flex: 1 }} source={{ uri: data.images[1] }} />
        <Image style={{ flex: 1 }} source={{ uri: data.images[2] }} />
      </View>
      <View style={styles.thirdRow}>
        <Image style={{ flex: 1 }} source={{ uri: data.images[3] }} />
        <Image style={{ flex: 1 }} source={{ uri: data.images[4] }} />
        <Image style={{ flex: 1 }} source={{ uri: data.images[5] }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error[50],
    borderRadius: 10,
    aspectRatio: 0.78,
    overflow: 'hidden',
  },
  secondRow: {
    flex: 3,
    backgroundColor: COLORS.success[300],
    flexDirection: 'row',
  },
  thirdRow: {
    flex: 2,
    backgroundColor: COLORS.secondary[300],
    flexDirection: 'row',
  },
});
