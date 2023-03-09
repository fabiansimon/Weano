import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import COLORS from '../constants/Theme';
import i18n from '../utils/i18n';
import Body from './typography/Body';

const WIDTH = 100;

export default function SwipeView({
  onDelete, string, children, enabled,
}) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const renderRightAction = (_, dragX) => {
    const translateX = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [50, WIDTH],
    });
    return (
      <AnimatedPressable style={[styles.rightAction, { transform: [{ translateX }] }]} onPress={onDelete}>
        <Body
          type={1}
          color={COLORS.shades[0]}
          text={string || i18n.t('Delete')}
        />
      </AnimatedPressable>
    );
  };

  return (
    <Swipeable
      enabled={enabled}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={20}
      renderRightActions={renderRightAction}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error[900],
    width: WIDTH,
  },
});
