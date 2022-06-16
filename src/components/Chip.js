import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function Chip({
  string, onDelete, onPress, style,
}) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} disabled={!onPress}>
      <Headline type={3} text={string} color={COLORS.primary[500]} />
      <Icon name="closecircle" color={COLORS.primary[500]} size={22} style={{ marginLeft: 12 }} onPress={onDelete} suppressHighlighting />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    maxHeight: 55,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.primary[500],
    backgroundColor: COLORS.shades[0],
  },
});
