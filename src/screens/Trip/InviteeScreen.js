import { View, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import COLORS, { PADDING } from '../../constants/Theme';
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

export default function InviteeScreen({ route }) {
  const { data } = route.params;
  const [sortedData, setSortedData] = useState({});

  const sortInvitees = () => {
    const accepted = data && data.filter((invitee) => invitee.status === 'ACCEPTED');
    const pending = data && data.filter((invitee) => invitee.status === 'PENDING');
    const declined = data && data.filter((invitee) => invitee.status === 'DECLINED');

    setSortedData({
      accepted,
      pending,
      declined,
    });
  };

  useEffect(() => {
    sortInvitees();
  }, [data]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const getTile = ({ item }) => (

    <View style={styles.tile}>
      <Avatar
        uri={item.uri}
        size={40}
        style={{ marginRight: 10 }}
      />
      <View style={{ marginRight: 'auto' }}>
        <Headline
          type={4}
          text={item.phoneNumber}
        />
        <Subtitle
          type={2}
          color={COLORS.neutral[300]}
          text={`${i18n.t('member since')} ${Utils.getDateFromTimestamp(data.memberSince, 'DD.MM.YYYY')}`}
        />
      </View>
      <RoleChip isHost={data.isHost} />
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
            type={3}
            text={`${i18n.t('Accepted')} (${sortedData.accepted ? sortedData.accepted.length : 0})`}
          />
          <FlatList
            ListEmptyComponent={(
              <Body
                style={{ textAlign: 'center', marginTop: 18 }}
                text={i18n.t('No one accepted yet')}
                color={COLORS.neutral[300]}
              />
            )}
            data={sortedData.accepted}
            renderItem={(item) => getTile(item)}
          />
          <Divider
            vertical={24}
            color={COLORS.neutral[50]}
          />
          <Headline
            type={3}
            text={`${i18n.t('Pending')} (${sortedData.pending ? sortedData.pending.length : 0})`}
          />
          <FlatList
            ListEmptyComponent={(
              <Body
                style={{ textAlign: 'center', marginTop: 18 }}
                text={i18n.t('No one is pending')}
                color={COLORS.neutral[300]}
              />
            )}
            data={sortedData.pending}
            renderItem={(item) => getTile(item)}
          />
          <Divider
            vertical={24}
            color={COLORS.neutral[50]}
          />
          <Headline
            type={3}
            text={`${i18n.t('Declined')} (${sortedData.declined ? sortedData.declined.length : 0})`}
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
            data={sortedData.declined}
            renderItem={(item) => getTile(item)}
          />
        </View>
      </HybridHeader>
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
});
