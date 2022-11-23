import {
  StyleSheet, FlatList, View, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Body from './typography/Body';
import Avatar from './Avatar';
import Headline from './typography/Headline';

export default function ContactsModal({
  isVisible, onRequestClose, data, onPress,
}) {
  const getContactTile = (item, index) => {
    const { isInvited } = item;
    const fullName = `${item.givenName} ${item.familyName}`;

    return (
      <View style={styles.contactTile}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            disabled
            uri={item.hasThumbnail && item.thumbnailPath}
            size={40}
          />
          <View style={{ marginLeft: 10 }}>
            <Body
              type={1}
              text={fullName}
              color={COLORS.neutral[700]}
            />
            <Body
              type={2}
              color={COLORS.neutral[300]}
              text={item.phoneNumbers[0]?.number}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onPress(index)}
          activeOpacity={0.8}
          style={[styles.inviteButton, { backgroundColor: isInvited ? 'transparent' : COLORS.neutral[900] }]}
        >
          <Headline
            type={4}
            color={isInvited ? COLORS.neutral[900] : COLORS.shades[0]}
            text={isInvited ? i18n.t('Invited') : i18n.t('Invite')}
          />
          {!isInvited && (
          <Icon
            name="plus"
            style={{ marginLeft: 4 }}
            size={20}
            color={COLORS.shades[0]}
          />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Add friends')}
    >
      <FlatList
        style={{ marginHorizontal: PADDING.l }}
        data={data}
        extraData={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => getContactTile(item, index)}
      />
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  contactTile: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-center',
    justifyContent: 'space-between',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: 40,
    borderWidth: 2,
    borderColor: COLORS.neutral[900],
    borderRadius: RADIUS.xl,
  },
});
