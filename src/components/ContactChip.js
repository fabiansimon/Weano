import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function ContactChip({
  string, onDelete, onPress, style,
}) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Headline
        numberOfLines={1}
        ellipsizeMode="tail"
        type={3}
        text={string}
        color={COLORS.primary[500]}
        style={{ marginRight: 12, maxWidth: '90%' }}
      />
      <Icon
        name="closecircle"
        color={COLORS.primary[500]}
        size={22}
        onPress={onDelete}
        suppressHighlighting
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    maxWidth: '90%',
    height: 55,
    maxHeight: 55,
    borderRadius: 100,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.primary[500],
    backgroundColor: COLORS.shades[0],
  },
});
