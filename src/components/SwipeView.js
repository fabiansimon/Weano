import React, {useRef} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import COLORS from '../constants/Theme';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const WIDTH = 100;

export default function SwipeView({
  onPress,
  string,
  children,
  enabled,
  backgroundColor = COLORS.error[900],
  multipleOptions,
}) {
  const swipeRef = useRef();

  const options = multipleOptions?.filter(option => !option.isDisabled);

  const renderRightAction = (_, dragX) => {
    const maxInput = options ? WIDTH * options.length : WIDTH;

    const translateX = dragX.interpolate({
      inputRange: [0, maxInput],
      outputRange: [50, WIDTH],
    });
    return (
      <Animated.View
        style={[{transform: [{translateX}], flexDirection: 'row'}]}>
        {!multipleOptions ? (
          <Pressable
            onPress={() => {
              onPress();
              swipeRef.current?.close();
            }}
            style={[styles.rightAction, {backgroundColor}]}>
            <Body
              type={2}
              style={{fontWeight: '500'}}
              color={COLORS.shades[0]}
              text={string || i18n.t('Delete')}
            />
          </Pressable>
        ) : (
          options.map(option => {
            const {backgroundColor: bg, string, onPress, isInactive} = option;
            return (
              <Pressable
                disabled={isInactive}
                onPress={() => {
                  onPress();
                  swipeRef.current?.close();
                }}
                style={[
                  styles.rightAction,
                  {backgroundColor: isInactive ? COLORS.neutral[300] : bg},
                ]}>
                <Body
                  type={2}
                  style={{fontWeight: '500'}}
                  color={option?.fontColor || COLORS.shades[0]}
                  text={string}
                />
              </Pressable>
            );
          })
        )}
      </Animated.View>
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
    height: '100%',
  },
});
