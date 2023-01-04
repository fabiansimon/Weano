import {
  View, StyleSheet, FlatList, Pressable, Share,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useMutation } from '@apollo/client';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Divider from '../../components/Divider';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Headline from '../../components/typography/Headline';
import Subtitle from '../../components/typography/Subtitle';
import Avatar from '../../components/Avatar';
import Utils from '../../utils';
import RoleChip from '../../components/RoleChip';
import Body from '../../components/typography/Body';
import FAButton from '../../components/FAButton';
import InputModal from '../../components/InputModal';
import activeTripStore from '../../stores/ActiveTripStore';
import httpService from '../../utils/httpService';
import ADD_INVITEES from '../../mutations/addInvitees';
import FilterModal from '../../components/FilterModal';
import REMOVE_INVITEE from '../../mutations/removeInvitee';

export default function InviteeScreen() {
  const { invitees, hostId, id } = activeTripStore((state) => state.activeTrip);
  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);
  const [inputVisible, setInputVisible] = useState(false);
  const [userSelected, setUserSelected] = useState(null);
  const [addInvitees, { error }] = useMutation(ADD_INVITEES);
  const [removeInvitee] = useMutation(REMOVE_INVITEE);

  const options = {
    title: userSelected,
    options: [
      {
        name: 'Resend Invite',
        value: 'resendInvite',
      },
      {
        name: 'Remove User',
        value: 'removeUser',
        deleteAction: true,
      },
    ],
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error.message,
        });
      }, 500);
    }
  }, [error]);

  const handleShare = () => {
    Share.share({
      message: `Hey! You've been invited to join a trip! Click the link below to join! http://143.198.241.91:4000/redirect/invitation/${id}`,
    });
  };
  const copyLink = () => {
    Clipboard.setString(`http://143.198.241.91:4000/redirect/invitation/${id}`);
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

    const oldData = invitees;
    const newInvitees = invites.map((email) => ({
      status: 'PENDING',
      email,
    }));
    updateActiveTrip({ invitees: invitees.concat(newInvitees) });

    await httpService.sendInvitations(param, id)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: i18n.t('Invitations sent!'),
          text2: i18n.t('The invites where successful sent to their emails!'),
        });
      }).then(async () => {
        await addInvitees({
          variables: {
            data: {
              emails: invites,
              tripId: id,
            },
          },
        }).catch((e) => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
          updateActiveTrip({ invitees: oldData });
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: err.message,
        });
        updateActiveTrip({ invitees: oldData });
      });
  };

  const handleInput = async (operation, user) => {
    if (operation === 'resendInvite') {
      await httpService.sendInvitations(user, id)
        .then(() => {
          Toast.show({
            type: 'success',
            text1: i18n.t('Invitations sent!'),
            text2: i18n.t('The invite was successful sent to their email!'),
          });
        })
        .catch((err) => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: err.message,
          });
        });
    }

    if (operation === 'removeUser') {
      const oldInvitees = invitees;

      updateActiveTrip({ invitees: invitees.filter((invitee) => invitee.email !== user) });
      await removeInvitee({
        variables: {
          data: {
            email: user,
            tripId: id,
          },
        },
      }).catch((e) => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        updateActiveTrip({ invitees: oldInvitees });
      });
    }
  };

  const accepted = invitees && invitees.filter((invitee) => invitee.status === 'ACCEPTED');
  const pending = invitees && invitees.filter((invitee) => invitee.status === 'PENDING');
  const declined = invitees && invitees.filter((invitee) => invitee.status === 'DECLINED');

  const scrollY = useRef(new Animated.Value(0)).current;

  const getTile = ({ item }) => (
    <Pressable
      onPress={() => item.status === 'PENDING' && setUserSelected(item.email)}
      style={styles.tile}
    >
      <Avatar
        uri={item.uri}
        size={40}
        style={{ marginRight: 10 }}
      />
      <View style={{ marginRight: 'auto' }}>
        <Body
          type={1}
          text={item.email}
        />
        <Subtitle
          type={2}
          color={COLORS.neutral[300]}
          text={`${i18n.t('member since')} ${Utils.getDateFromTimestamp(invitees.memberSince, 'DD.MM.YYYY')}`}
        />
      </View>
      <RoleChip isHost={item.id === hostId} />
    </Pressable>
  );

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
        title={i18n.t('Invitees')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={{ marginHorizontal: PADDING.l }}>
          <Headline
            style={{ marginTop: 10 }}
            type={4}
            text={`${i18n.t('Accepted')} (${accepted ? accepted.length : 0})`}
          />
          <FlatList
            ListEmptyComponent={(
              <Body
                style={{ textAlign: 'center', marginTop: 18 }}
                text={i18n.t('No one accepted yet')}
                color={COLORS.neutral[300]}
              />
            )}
            data={accepted}
            renderItem={(item, index) => getTile(item, index)}
          />
          <Divider
            vertical={24}
            color={COLORS.neutral[50]}
          />
          <Headline
            type={4}
            text={`${i18n.t('Pending')} (${pending ? pending.length : 0})`}
          />
          <FlatList
            ListEmptyComponent={(
              <Body
                style={{ textAlign: 'center', marginTop: 18 }}
                text={i18n.t('No one is pending')}
                color={COLORS.neutral[300]}
              />
            )}
            data={pending}
            renderItem={(item, index) => getTile(item, index)}
          />
          <Divider
            vertical={24}
            color={COLORS.neutral[50]}
          />
          <Headline
            type={4}
            text={`${i18n.t('Declined')} (${declined ? declined.length : 0})`}
          />
          <FlatList
            ListEmptyComponent={(
              <Body
                style={{ textAlign: 'center', marginTop: 18 }}
                text={i18n.t('No one declined yet')}
                color={COLORS.neutral[300]}
              />
            )}
            contentContainerStyle={{ paddingBottom: 60 }}
            data={declined}
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
        onPress={(m) => handleInput(m.value, userSelected)}
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
    borderWidth: 1,
    borderColor: COLORS.secondary[900],
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.secondary[700],
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
