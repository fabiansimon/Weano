import { StyleSheet, View } from 'react-native';
import React from 'react';
import Avatar from './Avatar';
import Headline from './typography/Headline';
import RoleChip from './RoleChip';
import Subtitle from './typography/Subtitle';
import Utils from '../utils';
import i18n from '../utils/i18n';
import COLORS from '../constants/Theme';

export default function InviteeTile({ style, data }) {
  return (
    <View style={[styles.container, style]}>
      <Avatar
        uri={data.uri}
        size={40}
        style={{ marginRight: 10 }}
      />
      <View style={{ marginRight: 'auto' }}>
        <Headline
          type={4}
          text={data.name}
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
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
