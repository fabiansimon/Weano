import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../constants/Theme';
import Body from './typography/Body';

export default function ContactChip({string, onDelete, onPress, style}) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={!onPress}>
      <Body
        numberOfLines={1}
        ellipsizeMode="tail"
        type={1}
        text={string}
        color={COLORS.primary[500]}
        style={{marginRight: 12, maxWidth: '90%', fontWeight: '500'}}
      />
      <Icon
        name="closecircle"
        color={COLORS.primary[500]}
        size={20}
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
    height: 50,
    maxHeight: 55,
    borderRadius: 100,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.primary[500],
    backgroundColor: COLORS.shades[0],
  },
});
