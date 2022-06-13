import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function Button({
  style, text, onPress, isDisabled, icon, color,
}) {
  const flex = text ? 1 : 0;

  const getIcon = () => (typeof icon.type === 'function' ? (
    React.cloneElement(icon, { fill: color })
  ) : (
    <Icon name={icon} color={color} size={20} />
  ));

  return (
    <TouchableOpacity style={[styles.container, style, { flex }]} onPress={onPress} disabled={isDisabled}>
      <Headline type={4} text={text} color={COLORS.shades[0]} />
      {icon && getIcon()}
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
    backgroundColor: COLORS.primary[700],
  },
});
