import { View, StyleSheet, FlatList } from 'react-native';
import React, { useRef } from 'react';
import Animated from 'react-native-reanimated';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import InviteeTile from '../../components/InviteeTile';
import Divider from '../../components/Divider';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Headline from '../../components/typography/Headline';

export default function InviteeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const mockInvitees = [
    {
      name: 'Fabian Simon',
      uri: 'https://i.pravatar.cc/300',
      status: 1,
      isHost: true,
      memberSince: 1629467605,
    },
    {
      name: 'Fabian Stefan',
      uri: 'https://i.pravatar.cc/300',
      status: 1,
      isHost: false,
      memberSince: 1629467605,
    },
    {
      name: 'Julia Stefan',
      uri: 'https://i.pravatar.cc/300',
      status: 0,
      isHost: false,
      memberSince: 1629467605,
    },
    {
      name: 'Matthias Betonmisha',
      uri: 'https://i.pravatar.cc/300',
      status: 2,
      isHost: false,
      memberSince: 1629467605,
    },
  ];

  const getTile = ({ item }) => (
    <InviteeTile data={item} style={{ marginTop: 20 }} />
  );

  const isComingData = mockInvitees.filter((person) => person.status === 0);
  const isMaybeData = mockInvitees.filter((person) => person.status === 1);
  const isNotData = mockInvitees.filter((person) => person.status === 2);

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
            text={`${i18n.t('Coming')} (${isComingData.length})`}
          />
          <FlatList
            data={isComingData}
            renderItem={(item) => getTile(item)}
          />
          <Divider
            vertical={24}
            color={COLORS.neutral[50]}
          />
          <Headline
            type={3}
            text={`${i18n.t('Maybe')} (${isMaybeData.length})`}
          />
          <FlatList
            data={isMaybeData}
            renderItem={(item) => getTile(item)}
          />
          <Divider
            vertical={24}
            color={COLORS.neutral[50]}
          />
          <Headline
            type={3}
            text={`${i18n.t('Not coming')} (${isNotData.length})`}
          />
          <FlatList
            contentContainerStyle={{ paddingBottom: 60 }}
            data={isNotData}
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
});
