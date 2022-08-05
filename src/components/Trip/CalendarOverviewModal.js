import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useState, useRef } from 'react';
import moment from 'moment';
import TitleModal from '../TitleModal';
import i18n from '../../utils/i18n';
import COLORS from '../../constants/Theme';
import CalendarAvailabilityContainer from '../../../CalendarAvailabilityContainer';
import Utils from '../../utils';
import Headline from '../typography/Headline';
import CalendarDateTile from './CalendarDateTile';

export default function CalendarOverviewModal({ isVisible, onRequestClose, data }) {
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
