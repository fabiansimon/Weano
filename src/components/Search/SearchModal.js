import { View, StyleSheet, Modal } from 'react-native';
import React, { useRef } from 'react';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../HybridHeader';
import INFORMATION from '../../constants/Information';
import BasicHeader from '../BasicHeader';

export default function LocationScreen({ isVisible, onRequestClose }) {
  const scrollY = useRef(new Animated.Value(-100)).current;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onRequestClose}
    >
      <SafeAreaView style={styles.container}>
        <BasicHeader
          title={i18n.t('Find location')}
          scrollY={scrollY}
          info={INFORMATION.dateScreen}
        >
          <View style={styles.innerContainer} />
        </BasicHeader>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: PADDING.s,
    paddingTop: 15,
    paddingBottom: 36,
  },

});
