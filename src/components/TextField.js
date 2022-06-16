/* eslint-disable react/jsx-props-no-spreading */
import {
  TextInput, StyleSheet, TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function TextField({
  value,
  onChangeText,
  style,
  prefix,
  onPrefixPress,
  onDelete,
  placeholder,
  keyboardType,
  focusable = true,
  icon,
  onPress,
  iconColor,
  disabled,
}) {
  const [focused, setFocused] = useState(false);

  const getIcon = () => (icon && typeof icon.type === 'function' ? (
    React.cloneElement(icon, { fill: iconColor })
  ) : (
    <Icon name={icon} color={iconColor || COLORS.neutral[700]} size={20} />
  ));

  return (
    <TouchableOpacity
      style={[styles.container, focused ? styles.activeContainer : styles.inactiveContainer, style]}
      onPress={onPress}
      disabled={!onPress}
    >
      {prefix && (
      <TouchableOpacity onPress={onPrefixPress} style={styles.prefixContainer}>
        <Headline type={4} text={`+ ${prefix}`} color={COLORS.neutral[700]} />
      </TouchableOpacity>
      )}
      <TextInput
        onPressIn={onPress || null}
        editable={!disabled}
        keyboardType={keyboardType}
        onFocus={() => focusable && setFocused(true)}
        style={styles.textInput}
        value={value || null}
        onChangeText={(val) => onChangeText(val)}
        placeholder={prefix ? `+${prefix} ${placeholder}` : placeholder}
      />
      {icon && (
      <TouchableOpacity onPress={onPrefixPress} style={styles.trailingContainer}>
        {getIcon()}
      </TouchableOpacity>
      )}
      {value && !disabled && (
      <Icon
        name="closecircle"
        suppressHighlighting
        onPress={onDelete}
        size={20}
        color={COLORS.neutral[500]}
        style={styles.deleteIcon}
      />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: COLORS.shades[0],
    borderRadius: 10,
    shadowColor: COLORS.shades[100],
    borderWidth: 1,
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  inactiveContainer: {
    borderColor: COLORS.neutral[100],
  },
  activeContainer: {
    borderColor: COLORS.neutral[700],
  },
  deleteIcon: {
    position: 'absolute',
    right: 15,
  },
  prefixContainer: {
    paddingHorizontal: 15,
    borderRightColor: COLORS.neutral[100],
    borderRightWidth: 1,
    height: '100%',
    justifyContent: 'center',
  },
  trailingContainer: {
    paddingHorizontal: 25,
    borderLeftColor: COLORS.neutral[100],
    borderLeftWidth: 1,
    height: '100%',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'WorkSans-Regular',
    letterSpacing: -1.0,
    paddingHorizontal: 12,
  },
});
