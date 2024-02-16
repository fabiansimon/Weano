import React from 'react';
import {StyleSheet, View} from 'react-native';
import EntIcon from 'react-native-vector-icons/Entypo';
import COLORS from '../constants/Theme';

export default function Checkbox({style, isChecked}) {
  const backgroundColor = isChecked ? COLORS.success[700] : 'transparent';
  const borderWidth = isChecked ? 0 : 1;

  return (
    <View
      style={[
        styles.checkbox,
        {
          backgroundColor,
          borderWidth,
        },
        style,
      ]}>
      {isChecked && <EntIcon name="check" color={COLORS.shades[0]} size={18} />}
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    borderColor: COLORS.neutral[300],
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    width: 26,
    height: 26,
  },
});
