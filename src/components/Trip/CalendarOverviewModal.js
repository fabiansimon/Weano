import { StyleSheet, View } from 'react-native';
import React, { useState, useRef } from 'react';
import TitleModal from '../TitleModal';
import i18n from '../../utils/i18n';
import COLORS from '../../constants/Theme';
import CalendarAvailabilityContainer from '../../../CalendarAvailabilityContainer';

export default function CalendarOverviewModal({ isVisible, onRequestClose, data }) {
  const [isAvailable, setIsAvailable] = useState(false);
  const pageRef = useRef(null);

  const handleChange = (available) => {
    if (isAvailable !== available) {
      pageRef.current?.setPage(isAvailable ? 1 : 0);
      setIsAvailable(available);
    }
  };

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Calendar Overview 📅')}
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
