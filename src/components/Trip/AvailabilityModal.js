import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import TitleModal from '../TitleModal';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import COLORS, { RADIUS } from '../../constants/Theme';
import Button from '../Button';
import AvailabilityTile from './AvailabilityTile';
import Body from '../typography/Body';

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
      title={i18n.t('Add (un)availability')}
    >
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => handleChange(true)}
            activeOpacity={0.8}
            style={[styles.innerTab, isAvailable && styles.activeTab, { borderTopLeftRadius: isAvailable && 6, borderBottomLeftRadius: isAvailable && 6 }]}
          >
            <Body
              type={1}
              color={isAvailable ? COLORS.shades[0] : COLORS.primary[700]}
              text={i18n.t('Available')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChange(false)}
            activeOpacity={0.8}
            style={[styles.innerTab, !isAvailable && styles.activeTab, { borderTopRightRadius: !isAvailable && 6, borderBottomRightRadius: !isAvailable && 6 }]}
          >
            <Body
              type={1}
              color={!isAvailable ? COLORS.shades[0] : COLORS.primary[700]}
              text={i18n.t('Unavailable')}
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
    backgroundColor: COLORS.primary[500],
  },
  innerTab: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    height: 36,
    justifyContent: 'space-between',
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.primary[500],
    borderWidth: 1,
  },
});
