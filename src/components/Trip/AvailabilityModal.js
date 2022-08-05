import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import TitleModal from '../TitleModal';
import KeyboardView from '../KeyboardView';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import COLORS from '../../constants/Theme';
import Button from '../Button';
import AvailabilityTile from './AvailabilityTile';

export default function AvailabilityModal({ isVisible, onRequestClose, data }) {
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
      title={i18n.t('Add (un)availability ⏰')}
    >
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handleChange(true)}
            style={[styles.innerTab, isAvailable && styles.activeTab]}
          >
            <Headline
              type={4}
              color={isAvailable ? COLORS.shades[100] : COLORS.neutral[500]}
              text={i18n.t('available')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChange(false)}
            style={[styles.innerTab, !isAvailable && styles.activeTab]}
          >
            <Headline
              type={4}
              color={!isAvailable ? COLORS.shades[100] : COLORS.neutral[500]}
              text={i18n.t('unavailable')}
            />
          </TouchableOpacity>
        </View>
        <PagerView
          style={{ flex: 1 }}
          ref={pageRef}
          scrollEnabled={false}
        >
          <View style={{ paddingHorizontal: 15 }}>
            {data.available.map((date, index) => (
              <AvailabilityTile
                style={{ marginTop: index === 0 ? 30 : 15 }}
                dateRange={date.dateRange}
              />
            )) }
          </View>
          <View style={{ paddingHorizontal: 15 }}>
            {data.unavailable.map((date, index) => (
              <AvailabilityTile
                isAvailable={false}
                style={{ marginTop: index === 0 ? 30 : 15 }}
                dateRange={date.dateRange}
              />
            )) }
          </View>
        </PagerView>
      </View>
      <Button
        text={i18n.t('Add availibility')}
        style={{ marginBottom: 30, marginHorizontal: 15 }}
      />
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  activeTab: {
    backgroundColor: COLORS.shades[0],
  },
  innerTab: {
    borderRadius: 12,
    height: '90%',
    marginHorizontal: 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    height: 45,
    justifyContent: 'space-between',
    borderRadius: 14,
    backgroundColor: COLORS.neutral[100],
  },
});
