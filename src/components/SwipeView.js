import React, {useCallback, useRef} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import COLORS from '../constants/Theme';
import i18n from '../utils/i18n';
import Body from './typography/Body';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

const WIDTH = 100;

export default function SwipeView({
  onPress,
  string,
  children,
  enabled,
  backgroundColor = COLORS.error[900],
  onLeftAction,
  multipleOptions,
}) {
  const swipeRef = useRef();

  const options = multipleOptions?.filter(option => !option.isDisabled);

  const renderLeftActions = useCallback(
    (_, dragX) => {
      const animatedScale = dragX.interpolate({
        inputRange: [0, WIDTH],
        outputRange: [0.7, 1.2],
      });
      const animatedOpacity = dragX.interpolate({
        inputRange: [0, WIDTH / 2, WIDTH],
        outputRange: [0.6, 0.5, 1],
      });

      if (dragX.__getValue() > WIDTH * 0.6) {
        swipeRef.current?.close();
        RNReactNativeHapticFeedback.trigger('impactLight');
        onLeftAction();
      }
      return (
        <View style={{flexDirection: 'row'}}>
          <Animated.View
            style={[
              styles.leftAction,
              {backgroundColor: COLORS.success[500], opacity: animatedOpacity},
            ]}>
            <Animated.View
              style={{
                transform: [{scale: animatedScale}],
                alignItems: 'center',
              }}>
              <Icon name="add" color={COLORS.shades[0]} size={20} />
              <Body
                type={2}
                style={{fontWeight: '500'}}
                color={COLORS.shades[0]}
                text={i18n.t('Add')}
              />
            </Animated.View>
          </Animated.View>
        </View>
      );
    },
    [onLeftAction],
  );

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
          options.map((option, index) => {
            const {backgroundColor: bg, string, onPress, isInactive} = option;
            return (
              <Pressable
                key={index}
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
        leftThreshold={10000}
        renderLeftActions={onLeftAction && renderLeftActions}
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
  leftAction: {
    alignItems: 'flex-start',
    paddingLeft: WIDTH / 2 - 10,
    justifyContent: 'center',
    width: WIDTH * 2,
    height: '100%',
  },
});
