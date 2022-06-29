import { StyleSheet, View } from 'react-native';
import React from 'react';
import i18n from '../utils/i18n';
import Subtitle from './typography/Subtitle';
import COLORS from '../constants/Theme';

export default function RoleChip({ style, isHost = false }) {
  const title = isHost ? i18n.t('Host') : i18n.t('Attendee');
  const backgroundColor = isHost ? COLORS.primary[700] : COLORS.secondary[700];

  return (
    <View style={[styles.container, style, { backgroundColor }]}>
      <Subtitle
        type={1}
        text={title}
        color={COLORS.shades[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
