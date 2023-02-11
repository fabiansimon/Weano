import React from 'react';
import Animated from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import COLORS from '../constants/Theme';

function AnimatedHeader({
  scrollY, style, children, maxHeight, minHeight, marginTop = 0, threshold = 2, scrollDistance,
}) {
  const HEADER_MAX_HEIGHT = maxHeight || 250;
  const HEADER_MIN_HEIGHT = minHeight || 60; // min header height
  const HEADER_SCROLL_DISTANCE = scrollDistance || (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT);

  // Animated Header Data
  const translateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / threshold, HEADER_SCROLL_DISTANCE],
    outputRange: [-200, 0, -10],
    extrapolate: 'clamp',
  });
  const opacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / threshold, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        [styles.stickyHeader, style, { marginTop }],
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
    backgroundColor: COLORS.shades[0],
    shadowColor: COLORS.shades[100],
    shadowOffset: {
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.08,
  },
});

export default AnimatedHeader;
