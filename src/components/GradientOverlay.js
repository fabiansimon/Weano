import {StyleSheet, View} from 'react-native';
import React from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import COLORS from '../constants/Theme';

export default function GradientOverlay({
  style,
  height = 200,
  edges = ['top', 'bottom'],
}) {
  return (
    <>
      {edges.includes('top') && (
        <View style={[styles.topContainer, {height}, style]}>
          <LinearGradient
            style={[styles.gradient, {height}]}
            colors={[COLORS.neutral[900], 'transparent']}
          />
        </View>
      )}
      {edges.includes('bottom') && (
        <View style={[styles.bottomContainer, {height}, style]}>
          <LinearGradient
            style={[styles.gradient, {height}]}
            colors={['transparent', COLORS.neutral[900]]}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  gradient: {
    opacity: 0.8,
    width: '100%',
  },
});
