import React from 'react';
import {Platform, View} from 'react-native';
import Animated, {
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
} from 'react-native-reanimated';

export default function SensorView({style, children}) {
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 100,
  });
  const animatedStyle = useAnimatedStyle(() => {
    const {pitch, yaw} = animatedSensor.sensor.value;
    const yawValue =
      20 * (yaw < 0 ? 2.5 * Number(yaw.toFixed(2)) : Number(yaw.toFixed(2)));
    const pitchValue = 50 * pitch.toFixed(2);
    return {
      transform: [{translateX: pitchValue}, {translateY: yawValue}],
    };
  });

  if (Platform.OS === 'android') {
    return <View style={style}>{children}</View>;
  }

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
}
