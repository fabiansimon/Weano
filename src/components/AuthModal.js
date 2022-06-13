import {
  View, StyleSheet,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CountryPicker from 'react-native-country-picker-modal';
import PagerView from 'react-native-pager-view';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';
import TextField from './TextField';
import Body from './typography/Body';
import Button from './Button';
import KeyboardView from './KeyboardView';
import CodeInput from './CodeInput';

export default function AuthModal({ isVisible, onRequestClose }) {
  const [phoneNr, setPhoneNr] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('43');
  const pageRef = useRef(null);
  const [timer, setTimer] = useState(10);

  function useInterval() {
    setTimer(10);
    const interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        // eslint-disable-next-line no-unused-expressions
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000); // Each count lasts for a second
    return () => clearInterval(interval);
  }

  useEffect(() => {
    useInterval();
  }, []);

  const countryPickerTheme = {
    primaryColorVariant: COLORS.neutral[100],
    onBackgroundTextColor: COLORS.shades[100],
    fontSize: 18,
    filterPlaceholderTextColor: 'red',
    activeOpacity: 0.7,
    itemHeight: 70,
    marginHorizontal: 10,
  };

  const getTimerString = () => {
    if (timer >= 10) return `${i18n.t('Resend code in')} 0:${timer}`;
    if (timer < 10 && timer > 0) return `${i18n.t('Resend code in')} 0:0${timer}`;
    return 'Resend code';
  };

  const handleChange = (page) => {
    pageRef.current?.setPage(page);
  };

  return (
    <TitleModal isVisible={isVisible} onRequestClose={onRequestClose} title={i18n.t('Log in or signup')}>
      <KeyboardView>
        <View style={styles.container}>
          <PagerView
            style={{ flex: 1 }}
            ref={pageRef}
            scrollEnabled={false}
          >
            <View>
              <Headline type={4} text={i18n.t('Phone number')} color={COLORS.neutral[700]} />
              <TextField
                keyboardType="phone-pad"
                style={{ marginTop: 18, marginBottom: 10 }}
                prefix={countryCode}
                onPrefixPress={() => setPickerVisible(true)}
                value={phoneNr || null}
                onChangeText={(val) => setPhoneNr(val)}
                placeholder={i18n.t('123 45 56')}
                onDelete={() => setPhoneNr('')}
              />
              <Body
                type={2}
                text={i18n.t('We will confirm your number via text. Standard message and data rates apply')}
                color={COLORS.neutral[500]}
              />
            </View>
            <View>
              <Headline
                type={4}
                text={i18n.t('We’ve sent you the code by SMS to')}
                color={COLORS.neutral[700]}
              />
              <Headline
                type={4}
                onPress={() => handleChange(0)}
                text={`+${countryCode} ${phoneNr}`}
                style={{ fontWeight: '600' }}
                color={COLORS.neutral[900]}
              />
              <View style={{
                width: 280, marginTop: 26, marginBottom: 20, alignSelf: 'center',
              }}
              >
                <CodeInput />
              </View>
              <Body
                type={2}
                style={{ textDecorationLine: 'underline', alignSelf: 'center' }}
                onPress={() => console.log('hefffllo')}
                text={getTimerString()}
                color={COLORS.neutral[500]}
              />
            </View>
          </PagerView>

          <Button text={i18n.t('Next')} onPress={() => handleChange(1)} />
        </View>
      </KeyboardView>
      <CountryPicker
        containerButtonStyle={{ opacity: 0 }}
        flatListProps={{ marginHorizontal: 10 }}
        visible={pickerVisible}
        modalProps={{ presentationStyle: 'pageSheet' }}
        onClose={() => setPickerVisible(false)}
        theme={countryPickerTheme}
        onSelect={(country) => setCountryCode(country.callingCode[0])}
        withCallingCode
      />
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    padding: 25,
  },
});
