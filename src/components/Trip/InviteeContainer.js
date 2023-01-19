import {
  View, StyleSheet, ScrollView, FlatList, Pressable,
} from 'react-native';
import React from 'react';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import activeTripStore from '../../stores/ActiveTripStore';
import Avatar from '../Avatar';
import Body from '../typography/Body';
import RoleChip from '../RoleChip';

export default function InviteeContainer({ onLayout, onPress }) {
  const { activeMembers, hostId } = activeTripStore((state) => state.activeTrip);

  const getUserTile = (item) => {
    const {
      firstName, lastName, avatarUri, id, email,
    } = item;

    return (
      <Pressable onPress={onPress} style={styles.tile}>
        <Avatar
          size={40}
          disabled
          uri={avatarUri}
          style={{ marginRight: 10, marginLeft: -6 }}
        />
        <View>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between',
          }}
          >
            <Body
              type={1}
              color={COLORS.shades[100]}
              text={`${firstName} ${lastName}`}
            />
            <RoleChip
              isHost={hostId === id}
              style={{ top: -2, marginLeft: 10 }}
            />
          </View>
          <Body
            type={2}
            color={COLORS.neutral[300]}
            text={`${email}`}
          />
        </View>
      </Pressable>
    );
  };
  return (
    <View>
      <ScrollView
        horizontal
        scrollEnabled
        contentContainerStyle={{ paddingRight: 30 }}
        style={{ marginHorizontal: -PADDING.l, paddingHorizontal: PADDING.l }}
      >
        {activeMembers && activeMembers.map((member) => getUserTile(member))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.shades[0],
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    marginRight: 10,
  },
});
