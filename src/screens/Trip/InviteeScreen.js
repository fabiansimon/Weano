import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../constants/Theme';
import BasicHeader from '../../components/BasicHeader';
import i18n from '../../utils/i18n';
import InviteeTile from '../../components/InviteeTile';
import Divider from '../../components/Divider';
import Button from '../../components/Button';

export default function InviteeScreen() {
  const mockInvitees = [
    {
      name: 'Fabian Simon',
      uri: 'https://i.pravatar.cc/300',
      status: 1,
      isHost: true,
    },
    {
      name: 'Julia Stefan',
      uri: 'https://i.pravatar.cc/300',
      status: 0,
      isHost: false,
    },
    {
      name: 'Matthias Betonmisha',
      uri: 'https://i.pravatar.cc/300',
      status: 2,
      isHost: false,
    },
  ];

  const getTile = ({ item }) => (
    <InviteeTile data={item} style={{ marginVertical: 7.5 }} />
  );

  return (
    <View style={styles.container}>
      <BasicHeader title={i18n.t('Invitees')} />
      <FlatList
        style={{ paddingTop: 10 }}
        contentContainerStyle={{ paddingBottom: 60 }}
        data={mockInvitees}
        renderItem={(item) => getTile(item)}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <Divider color={COLORS.neutral[50]} />}
      />
      <SafeAreaView style={styles.footer}>
        <Button text={i18n.t('Invite more')} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  footer: {
    position: 'absolute',
    paddingHorizontal: 20,
    bottom: 10,
    width: '100%',
  },
});
