import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Divider from '../Divider';

export default function InviteeContainer({ data }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Headline type={4} text={`👍 ${i18n.t('Yes')}`} color={COLORS.neutral[700]} />
        <Headline type={4} text={`💭 ${i18n.t('Maybe')}`} color={COLORS.neutral[700]} />
        <Headline type={4} text={`👎 ${i18n.t('No')}`} color={COLORS.neutral[700]} />
      </View>
      <Divider top={15} bottom={4} />
      <View style={styles.bottomRow}>
        <Headline type={2} text="3" />
        <Headline type={2} text="2" />
        <Headline type={2} text="1" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
  },
  headerRow: {
    paddingHorizontal: 30,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    paddingHorizontal: 45,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
