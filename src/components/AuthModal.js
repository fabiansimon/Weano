import { View, StyleSheet } from 'react-native';
import React from 'react';
import { SearchBar } from 'react-native-screens';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';

export default function AuthModal({ isVisible, onRequestClose }) {
  return (
    <TitleModal isVisible={isVisible} onRequestClose={onRequestClose} title={i18n.t('Log in or signup')}>
      <View style={styles.container}>
        <Headline type={4} text={i18n.t('Phone number')} color={COLORS.neutral[700]} />
        <SearchBar />
      </View>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
});
