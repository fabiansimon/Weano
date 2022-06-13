import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';

export default function RecapCard({ style }) {
  return (
    <View style={[styles.container, style]}>
      <Text>RecapCard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error[700],
    borderRadius: 10,
    aspectRatio: 0.78,
  },
});
