import {
  View, StyleSheet, FlatList, Pressable, Share, Platform,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { MenuView } from '@react-native-menu/menu';
import { useMutation } from '@apollo/client';
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
import META_DATA from '../../constants/MetaData';
import userManagement from '../../utils/userManagement';
import REMOVE_USER_FROM_TRIP from '../../mutations/removeUserFromTrip';
import Utils from '../../utils';
import ContactDetailModal from '../../components/ContactDetailModal';

export default function InviteeScreen() {
  // MUTATIONS
  const [removeUser] = useMutation(REMOVE_USER_FROM_TRIP);

  // STORES
  const { activeMembers, hostId, id } = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [inputVisible, setInputVisible] = useState(false);
  const [showUser, setShowUser] = useState(null);

  const isHost = userManagement.isHost();

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

  const handleMenuOption = ({ event }, user) => {
    const { id: removeUserId } = user;

    if (event === 'remove') {
      Utils.showConfirmationAlert(
        i18n.t('Remove user'),
        i18n.t('Are you sure you want to remove'),
        i18n.t('Yes'),
        async () => {
          await removeUser({
            variables: {
              data: {
                id: removeUserId,
                tripId: id,
              },
            },
          }).then(() => {
            Toast.show({
              type: 'success',
              text1: i18n.t('Whooray!'),
              text2: i18n.t('User was succeessfully removed!'),
            });

            updateActiveTrip({ activeMembers: activeMembers.filter((a) => a.id !== removeUserId) });
          })
            .catch((e) => {
              Toast.show({
                type: 'error',
                text1: i18n.t('Whoops!'),
                text2: e.message,
              });
              console.log(`ERROR: ${e.message}`);
            });
        },
      );
    }
  };

  const getTile = ({ item }) => {
    const {
      firstName, lastName, email,
    } = item;
    return (

      <MenuView
        shouldOpenOnLongPress
        style={styles.tileContainer}
        onPressAction={({ nativeEvent }) => handleMenuOption(nativeEvent, item)}
        actions={[
          {
            id: 'remove',
            attributes: {
              disabled: !isHost,
              destructive: true,
            },
            title: i18n.t('Remove user'),
            image: Platform.select({
              ios: 'trash',
              android: 'ic_menu_delete',
            }),
          },
        ]}
      >
        <Pressable
          onPress={() => setShowUser(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
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
        </Pressable>
        <RoleChip isHost={item.id === hostId} />
      </MenuView>

    );
  };

  const getShareLinkButton = () => (
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
          getShareLinkButton()
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
      <ContactDetailModal
        isVisible={showUser}
        onRequestClose={() => setShowUser(null)}
        data={showUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
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
    backgroundColor: COLORS.primary[700],
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
  tileContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});
