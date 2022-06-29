import { StyleSheet, View } from 'react-native';
import React from 'react';
import Avatar from './Avatar';
import Headline from './typography/Headline';
import RoleChip from './RoleChip';
import AttendeeInfoCircle from './AttendeeInfoCircle';

export default function InviteeTile({ style, data }) {
  return (
    <View style={[styles.container, style]}>
      <Avatar uri={data.uri} size={50} style={{ marginRight: 20 }} />
      <View style={{ marginRight: 'auto' }}>
        <Headline type={4} text={data.name} style={{ marginBottom: 6 }} />
        <RoleChip isHost={data.isHost} />
      </View>
      <AttendeeInfoCircle status={data.status} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
