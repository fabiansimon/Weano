import { View, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function InfoBox({
  style, icon, text, color,
}) {
  const colorTheme = color || COLORS.neutral[900];

  return (
    <View style={[styles.container, style, { borderColor: colorTheme }]}>
      <Icon
        name={icon}
        size={20}
        color={colorTheme}
      />
      <Headline
        type={4}
        style={{ marginLeft: 8 }}
        text={text}
        color={colorTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[900],
    paddingHorizontal: 12,
  },
});
