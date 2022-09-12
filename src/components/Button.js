import {
  ActivityIndicator, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import React, { useRef } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Animated from 'react-native-reanimated';
import COLORS, { RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';

export default function Button({
  style,
  text,
  textColor,
  backgroundColor,
  onPress,
  isSecondary = false,
  isDisabled,
  icon,
  color,
  fullWidth = true,
  isLoading,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const duration = 250;

  const flex = fullWidth ? 1 : 0;
  const bg = isDisabled ? COLORS.primary[50] : backgroundColor || COLORS.primary[700];
  const borderColor = isSecondary && COLORS.neutral[100];
  const borderWidth = isSecondary && 1;

  const getIcon = () => (typeof icon.type === 'function' ? (
    React.cloneElement(icon, { fill: color })
  ) : (
    <Icon name={icon} color={color} size={20} />
  ));

  const getLoadingIndicator = () => (
    <ActivityIndicator color={COLORS.shades[0]} />
  );

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return (

    <Animated.View style={[
      style,
      styles.container,
      {
        backgroundColor: isSecondary ? COLORS.shades[0] : bg,
        borderColor,
        borderWidth,
        transform: [{ scale }],
      }]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={{ flex }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {icon && !isLoading && getIcon()}
        {text && !isLoading && (
        <Headline
          type={4}
          text={text}
          color={textColor || isSecondary ? COLORS.shades[100] : COLORS.shades[0]}
          style={{ marginLeft: icon ? 6 : 0 }}
        />
        )}
        {isLoading && getLoadingIndicator()}
      </TouchableOpacity>
    </Animated.View>

  // <TouchableOpacity
  //   onPressIn={handlePressIn}
  //   onPressOut={handlePressOut}
  //   activeOpacity={0.9}
  //   onPress={onPress}
  //   disabled={isDisabled}
  // >
  //   <Animated.View style={[
  //     animatedScale,
  //     styles.container,
  //     style, {
  //       flex,
  //       backgroundColor: isSecondary ? COLORS.shades[0] : bg,
  //       borderColor,
  //       borderWidth,
  //     }]}
  //   >
  //     {icon && !isLoading && getIcon()}
  //     {text && !isLoading && (
  //       <Headline
  //         type={4}
  //         text={text}
  //         color={textColor || isSecondary ? COLORS.shades[100] : COLORS.shades[0]}
  //         style={{ marginLeft: icon ? 6 : 0 }}
  //       />
  //     )}
  //     {isLoading && getLoadingIndicator()}
  //   </Animated.View>
  // </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    maxHeight: 50,
    minWidth: 50,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.l,
  },
});
