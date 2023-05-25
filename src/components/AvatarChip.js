import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import COLORS, {RADIUS} from '../constants/Theme';
import Avatar from './Avatar';
import Body from './typography/Body';

export default function AvatarChip({style, onPress, name, uri}) {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <Avatar
        size={25}
        avatarUri={uri}
        style={{borderColor: COLORS.primary[700]}}
      />
      <Body
        type={2}
        style={{marginHorizontal: 6, fontWeight: '500'}}
        color={COLORS.shades[0]}
        text={name}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
  },
});
