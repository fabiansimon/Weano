import React, {useRef} from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import COLORS from '../constants/Theme';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const WIDTH = 100;

export default function SwipeView({
  onDelete,
  string,
  children,
  enabled,
  backgroundColor = COLORS.error[900],
}) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const swipeRef = useRef();

  const renderRightAction = (_, dragX) => {
    const translateX = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [50, WIDTH],
    });
    return (
      <AnimatedPressable
        style={[
          styles.rightAction,
          {transform: [{translateX}], backgroundColor},
        ]}
        onPress={() => {
          onDelete();
          swipeRef.current?.close();
        }}>
        <Body
          type={1}
          color={COLORS.shades[0]}
          text={string || i18n.t('Delete')}
        />
      </AnimatedPressable>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Swipeable
        ref={swipeRef}
        enabled={enabled}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={20}
        renderRightActions={renderRightAction}>
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: WIDTH,
  },
});
