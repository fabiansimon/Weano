import {
  View, TextInput, StyleSheet, TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../constants/Theme';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';

export default function TextField({
  value, onChangeText, style, prefix, onPrefixPress
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused ? styles.activeContainer : styles.inactiveContainer, style]}>
      {prefix && (
      <TouchableOpacity onPress={onPrefixPress} style={styles.prefixContainer}>
        <Headline type={4} text="🇦🇹 +43" color={COLORS.neutral[700]} />
      </TouchableOpacity>
      )}
      <TextInput
        autoFocus
        onFocus={() => setFocused(true)}
        style={styles.textInput}
        value={value}
        onChangeText={(val) => onChangeText(val)}
        placeholder={i18n.t('+43 664 186 53 58')}
      />
      {value && <Icon name="closecircle" size={20} color={COLORS.neutral[500]} style={styles.deleteIcon} />}
    </View>
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
  textInput: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'WorkSans-Regular',
    letterSpacing: -1.0,
    paddingHorizontal: 12,
  },
});
