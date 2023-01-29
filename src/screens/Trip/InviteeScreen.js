import {
  View, StyleSheet, FlatList, Pressable, Share,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Avatar from '../../components/Avatar';
import RoleChip from '../../components/RoleChip';
import Body from '../../components/typography/Body';
import FAButton from '../../components/FAButton';
import InputModal from '../../components/InputModal';
import activeTripStore from '../../stores/ActiveTripStore';
import httpService from '../../utils/httpService';
import FilterModal from '../../components/FilterModal';
import META_DATA from '../../constants/MetaData';
import userManagement from '../../utils/userManagement';

export default function InviteeScreen() {
  const { activeMembers, hostId, id } = activeTripStore((state) => state.activeTrip);
  const [inputVisible, setInputVisible] = useState(false);
  const [userSelected, setUserSelected] = useState(null);

  const isHost = userManagement.isHost();

  const options = {
    title: `${userSelected?.firstName} ${userSelected?.lastName}`,
    options: [
      {
        name: 'Remove User',
        trailing: !isHost && <RoleChip isHost string={i18n.t('Must be host')} />,
        notAvailable: !isHost,
        onPress: () => console.log('removeUser'),
        deleteAction: isHost,
      },
    ],
  };

  const handleShare = () => {
    Share.share({
      message: `Hey! You've been invited to join a trip! Click the link below to join! ${META_DATA.baseUrl}/redirect/invitation/${id}`,
    });
  };
  const copyLink = () => {
    Clipboard.setString(`${META_DATA.baseUrl}/redirect/invitation/${id}`);
    Toast.show({
      type: 'success',
      text1: i18n.t('Copied!'),
      text2: i18n.t('You can now send it to your friends'),
    });
  };

  const handleInvitations = async (invites) => {
    if (invites.length <= 0) {
      return;
    }

    const param = invites.toString().replace(',', '&');

    await httpService.sendInvitations(param, id)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: i18n.t('Invitations sent!'),
          text2: i18n.t('The invites where successful sent to their emails!'),
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: err.message,
        });
      });
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  const getTile = ({ item }) => {
    const {
      firstName, lastName, email,
    } = item;
    return (
      <Pressable
        onPress={() => setUserSelected(item)}
        style={styles.tile}
      >
        <Avatar
          data={item}
          size={40}
          style={{ marginRight: 10 }}
        />
        <View style={{ marginRight: 'auto' }}>
          <Body
            type={1}
            color={COLORS.shades[100]}
            text={`${firstName} ${lastName}`}
          />
          <Body
            type={2}
            color={COLORS.neutral[300]}
            text={`${email}`}
          />
        </View>
        <RoleChip isHost={item.id === hostId} />
      </Pressable>
    );
  };

  const ShareLinkButton = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: PADDING.s }}>
      <Pressable
        onPress={handleShare}
        style={styles.shareButton}
      >
        <Body
          type={1}
          color={COLORS.shades[0]}
          text={i18n.t('Send friends invitation')}
        />
        <Icon
          style={{ marginLeft: 8 }}
          name="ios-share"
          color={COLORS.shades[0]}
          size={18}
        />
      </Pressable>
      <Pressable
        onPress={copyLink}
        style={styles.copyButton}
      >
        <Body
          type={1}
          color={COLORS.shades[100]}
          text={i18n.t('Copy link')}
        />
        <Icon
          style={{ marginLeft: 8 }}
          name="content-copy"
          color={COLORS.shades[100]}
          size={18}
        />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Travelers')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={{ marginHorizontal: PADDING.l }}>
          <FlatList
            ListEmptyComponent={(
              <Body
                style={{ textAlign: 'center', marginTop: 18 }}
                text={i18n.t('No active Members yet')}
                color={COLORS.neutral[300]}
              />
            )}
            contentContainerStyle={{ paddingBottom: 60 }}
            data={activeMembers}
            renderItem={(item, index) => getTile(item, index)}
          />
        </View>
      </HybridHeader>
      <FAButton
        icon="add"
        iconSize={28}
        onPress={() => setInputVisible(true)}
      />
      <InputModal
        topContent={(
          <ShareLinkButton />
        )}
        isVisible={inputVisible}
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize={false}
        emailInput
        placeholder={i18n.t('Invite friends')}
        onRequestClose={() => setInputVisible(false)}
        onPress={(input) => handleInvitations(input)}
        autoClose
      />
      <FilterModal
        isVisible={userSelected !== null}
        onRequestClose={() => setUserSelected(null)}
        data={options}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  tile: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.success[700],
    paddingVertical: 6,
  },
  copyButton: {
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.shades[0],
    paddingVertical: 6,
  },
});
