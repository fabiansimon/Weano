import {Animated, Pressable} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';

export default function SqueezePressable({style, onPress, children}) {
  const [isPressed, setIsPressed] = useState(false);
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const scale = useRef(new Animated.Value(1)).current;
  const duration = 50;

  useEffect(() => {
    if (isPressed) {
      Animated.timing(scale, {
        toValue: 0.8,
        duration,
        useNativeDriver: true,
      }).start();
    } else {
      onPress();
      Animated.timing(scale, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    }
  }, [isPressed]);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      style={[style, {transform: [{scale}]}]}>
      {children}
    </AnimatedPressable>
  );
}
