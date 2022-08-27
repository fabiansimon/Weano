import React, { useMemo } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import COLORS from '../../constants/Theme';

function BoardingPassBackDrop({ animatedIndex, style }) {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: COLORS.shades[100],
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return <Animated.View style={containerStyle} />;
}

export default BoardingPassBackDrop;
