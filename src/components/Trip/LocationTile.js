import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import Body from '../typography/Body';
import RoleChip from '../RoleChip';
import Divider from '../Divider';

export default function LocationTile({ style, location, host }) {
  return (
    <TouchableOpacity activeOpacity={0.6} style={[styles.tile, style]}>
      <Headline type={2} text={location} />
      <Divider />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Body type={2} text={host} color={COLORS.neutral[500]} />
        <RoleChip isHost style={{ marginLeft: 6 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: COLORS.shades[0],
    justifyContent: 'space-between',
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: COLORS.shades[100],
    shadowRadius: 10,
    shadowOpacity: 0.05,
  },
});
