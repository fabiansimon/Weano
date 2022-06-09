import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';
import TextField from './TextField';
import Body from './typography/Body';

export default function AuthModal({ isVisible, onRequestClose }) {
  const [phoneNr, setPhoneNr] = useState('');

  return (
    <TitleModal isVisible={isVisible} onRequestClose={onRequestClose} title={i18n.t('Log in or signup')}>
      <View style={styles.container}>
        <Headline type={4} text={i18n.t('Phone number')} color={COLORS.neutral[700]} />
        <TextField style={{ marginTop: 18, marginBottom: 10 }} prefix="+43" value={phoneNr || null} onChangeText={(val) => setPhoneNr(val)} />
        <Body type={2} text={i18n.t('We will confirm your number via text. Standard message and data rates apply')} color={COLORS.neutral[500]} />
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
