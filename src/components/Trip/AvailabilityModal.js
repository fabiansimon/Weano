import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import TitleModal from '../TitleModal';
import KeyboardView from '../KeyboardView';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import COLORS from '../../constants/Theme';
import Button from '../Button';
import AvailabilityTile from './AvailabilityTile';

export default function AvailabilityModal({ isVisible, onRequestClose, data }) {
  const [isAvailable, setIsAvailable] = useState(false);

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Add (un)availability ⏰')}
    >
      <KeyboardView>
        <View style={styles.container}>
          <View style={styles.tabContainer}>
            <View style={styles.hoverTabContainer} />
            <View style={styles.innerTabContainer}>
              <Headline
                onPress={() => setIsAvailable(true)}
                type={4}
                text={i18n.t('available')}
                color={isAvailable ? COLORS.shades[100] : COLORS.neutral[500]}
              />
              <Headline
                onPress={() => setIsAvailable(false)}
                type={4}
                color={!isAvailable ? COLORS.shades[100] : COLORS.neutral[500]}
                text={i18n.t('unavailable')}
              />
            </View>
          </View>
          {data.map((date, index) => (
            <AvailabilityTile
              style={{ marginTop: index === 0 ? 30 : 15 }}
              dateRange={date.dateRange}
            />
          )) }
        </View>
        <Button
          text={i18n.t('Add availibility')}
          style={{ marginBottom: 30, marginHorizontal: 20 }}
        />
      </KeyboardView>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  hoverTabContainer: {
    height: '90%',
    right: 0,
    position: 'absolute',
    marginHorizontal: 3,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    backgroundColor: COLORS.shades[0],
  },
  innerTabContainer: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.neutral[100],
  },
});
