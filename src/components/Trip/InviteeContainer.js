import {View, StyleSheet, ScrollView, Pressable} from 'react-native';
import React from 'react';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import activeTripStore from '../../stores/ActiveTripStore';
import Avatar from '../Avatar';
import Body from '../typography/Body';
import RoleChip from '../RoleChip';
import userManagement from '../../utils/userManagement';

export default function InviteeContainer({onPress}) {
  // STORES
  const {activeMembers, hostIds} = activeTripStore(state => state.activeTrip);

  activeMembers.sort((a, b) => {
    if (hostIds.includes(a.id) && !hostIds.includes(b.id)) {
      return -1;
    }
    return 0;
  });

  const getUserTile = item => {
    const {firstName, lastName, id, email} = item;

    return (
      <Pressable onPress={onPress} style={styles.tile}>
        <Avatar
          size={40}
          disabled
          data={item}
          style={{marginRight: 10, marginLeft: -6}}
        />
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Body
              type={1}
              color={COLORS.shades[100]}
              text={`${firstName} ${lastName}`}
            />
            <RoleChip
              isHost={hostIds.includes(id)}
              style={{top: -2, marginLeft: 10}}
            />
          </View>
          <Body type={2} color={COLORS.neutral[300]} text={`${email}`} />
        </View>
      </Pressable>
    );
  };
  return (
    <View>
      <ScrollView
        horizontal
        scrollEnabled
        contentContainerStyle={{paddingRight: 30}}
        style={{marginHorizontal: -PADDING.l, paddingHorizontal: PADDING.l}}>
        {activeMembers?.map(member => getUserTile(member))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.shades[0],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    marginRight: 10,
    minWidth: 300,
  },
});
