import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function Button({
  style,
  text,
  textColor,
  backgroundColor,
  onPress,
  isDisabled,
  icon,
  color,
  fullWidth = true,
}) {
  const flex = fullWidth ? 1 : 0;
  const bg = isDisabled ? COLORS.primary[50] : backgroundColor || COLORS.primary[700];

  const getIcon = () => (typeof icon.type === 'function' ? (
    React.cloneElement(icon, { fill: color })
  ) : (
    <Icon name={icon} color={color} size={20} />
  ));

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.container, style, { flex, backgroundColor: bg }]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {icon && getIcon()}
      {text && <Headline type={4} text={text} color={textColor || COLORS.shades[0]} style={{ marginLeft: icon ? 6 : 0 }} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    maxHeight: 50,
    minWidth: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
});
