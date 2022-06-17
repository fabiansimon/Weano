import React from 'react';
import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import COLORS from '../constants/Theme';

function AnimatedHeader({ scrollY, style, children }) {
  const HEADER_MAX_HEIGHT = 120; // max header height
  const HEADER_MIN_HEIGHT = 60; // min header height
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  // Animated Header Data
  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -8],
    extrapolate: 'clamp',
  });
  const opacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        [styles.stickyHeader, style],
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    zIndex: 10,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 120,
    backgroundColor: COLORS.shades[0],
    shadowColor: COLORS.shades[100],
    shadowOffset: {
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});

export default AnimatedHeader;
