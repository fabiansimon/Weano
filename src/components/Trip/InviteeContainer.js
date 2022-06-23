import { View, StyleSheet } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Divider from '../Divider';
import TripListContainer from './TripListContainer';

export default function InviteeContainer() {
  return (
    <TripListContainer>
      <View style={styles.headerRow}>
        <Headline type={4} text={`👍 ${i18n.t('Yes')}`} color={COLORS.neutral[700]} />
        <Headline type={4} text={`💭 ${i18n.t('Maybe')}`} color={COLORS.neutral[700]} />
        <Headline type={4} text={`👎 ${i18n.t('No')}`} color={COLORS.neutral[700]} />
      </View>
      <Divider top={15} bottom={8} />
      <View style={styles.bottomRow}>
        <Headline type={2} text="3" />
        <Headline type={2} text="2" />
        <Headline type={2} text="1" />
      </View>
    </TripListContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    marginBottom: -6,
    paddingHorizontal: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
