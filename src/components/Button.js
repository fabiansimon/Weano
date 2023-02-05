import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Icon from 'react-native-vector-icons/Entypo';
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
  disableHaptics = false,
  isLoading,
}) {
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

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.container, {
        flex, backgroundColor: isSecondary ? COLORS.shades[0] : bg, borderColor, borderWidth,
      }, style]}
      onPress={() => {
        // eslint-disable-next-line no-unused-expressions
        !isLoading && onPress();
        // eslint-disable-next-line no-unused-expressions
        !disableHaptics && ReactNativeHapticFeedback.trigger('impactLight', options);
      }}
      disabled={isDisabled}
    >
      {icon && !isLoading && getIcon()}
      {text && !isLoading && (
      <Headline
        type={4}
        text={text}
        color={textColor || (isSecondary ? COLORS.shades[100] : COLORS.shades[0])}
        style={{ marginLeft: icon ? 6 : 0 }}
      />
      )}
      {isLoading && getLoadingIndicator()}
    </TouchableOpacity>
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
