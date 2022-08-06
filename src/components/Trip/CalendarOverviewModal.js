import { StyleSheet, View } from 'react-native';
import React from 'react';
import TitleModal from '../TitleModal';
import i18n from '../../utils/i18n';
import COLORS from '../../constants/Theme';
import CalendarAvailabilityContainer from './CalendarAvailabilityContainer';

export default function CalendarOverviewModal({ isVisible, onRequestClose }) {
  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Calendar Overview')}
    >
      <View style={styles.container}>
        <CalendarAvailabilityContainer style={{ marginTop: 20 }} />
      </View>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
    paddingHorizontal: 10,
  },
});
