import {
  View, StyleSheet,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CountryPicker from 'react-native-country-picker-modal';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';
import TextField from './TextField';
import Body from './typography/Body';
import Button from './Button';
import KeyboardView from './KeyboardView';
import CodeInput from './CodeInput';
import ROUTES from '../constants/Routes';
import Divider from './Divider';
import REGISTER_USER from '../mutations/registerUser';
import LOGIN_USER from '../mutations/loginUser';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import Utils from '../utils';
import httpService from '../utils/httpService';

const asyncStorageDAO = new AsyncStorageDAO();

export default function AuthModal({ isVisible, onRequestClose, registerData }) {
  const [registerUser, { regData, regLoading, regError }] = useMutation(REGISTER_USER);
  const [loginUser, { logData, logLoading, logError }] = useMutation(LOGIN_USER);

  const [phoneNr, setPhoneNr] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [code, setCode] = useState('');
  const [countryCode, setCountryCode] = useState('43');
  const pageRef = useRef(null);
  const [timer, setTimer] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const isLogin = !registerData;

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

  useEffect(() => {
    if (code.length === 4) {
      if (!isLogin) {
        handleRegister();
        return;
      }
      handleLogin();
    }
  }, [code]);

  const requestCode = async () => {
    setIsLoading(true);
    const phoneNumber = `+${countryCode}${phoneNr.trim()}`;
    await httpService.getVerificationCode(phoneNumber)
      .then((res) => {
        if (res.status === 'pending') {
          pageRef.current?.setPage(1);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const checkCode = async () => {
    setIsLoading(true);
    const phoneNumber = `+${countryCode}${phoneNr.trim()}`;
    const res = await httpService.checkVerificationCode(phoneNumber, code);

    return res.status;
  };

  const handleRegister = async () => {
    const { email, firstName, lastName } = registerData;
    const phoneNumber = `+${countryCode}${phoneNr.trim()}`;

    const check = await checkCode();

    if (check !== 'approved') {
      setCode('');
      return;
    }

    await registerUser({
      variables: {
        user: {
          email,
          firstName,
          lastName,
          phoneNumber,
        },
      },
    }).then((res) => {
      asyncStorageDAO.setAccessToken(res.data.registerUser);
      asyncStorageDAO.setIsAuth(true);
      navigation.navigate(ROUTES.mainScreen);
      onRequestClose();
    }).catch((e) => {
      console.log(e);
    });
  };

  const handleLogin = async () => {
    const phoneNumber = `+${countryCode}${phoneNr.trim()}`;
    const check = await checkCode();

    if (check !== 'approved') {
      setCode('');
      return;
    }

    await loginUser({
      variables: {
        user: {
          phoneNumber,
        },
      },
    }).then((res) => {
      asyncStorageDAO.setAccessToken(res.data.loginUser);
      asyncStorageDAO.setIsAuth(true);
      navigation.navigate(ROUTES.mainScreen);
      onRequestClose();
    }).catch((e) => {
      console.log(e);
    });
  };

  const countryPickerTheme = {
    primaryColorVariant: COLORS.neutral[100],
    onBackgroundTextColor: COLORS.shades[100],
    fontSize: 16,
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

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={isLogin ? i18n.t('Log in') : i18n.t('Authenticate')}
    >
      <KeyboardView paddingBottom={50}>
        <View style={styles.container}>
          <PagerView
            style={{ flex: 1 }}
            ref={pageRef}
            scrollEnabled
          >
            <View style={{ padding: 25, justifyContent: 'space-between' }}>
              <View>
                <Headline
                  type={4}
                  text={i18n.t('Phone number')}
                  color={COLORS.neutral[700]}
                />
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
                  color={COLORS.neutral[300]}
                />
                {isLogin && (
                <>
                  <Divider
                    vertical={14}
                  />
                  <Body
                    type={2}
                    text={i18n.t('No account yet?')}
                    color={COLORS.neutral[300]}
                  />
                  <Headline
                    type={4}
                    style={{ marginTop: 6, textDecorationLine: 'underline' }}
                    text={i18n.t('Register')}
                    onPress={() => navigation.navigate(ROUTES.signUpScreen)}
                    color={COLORS.neutral[700]}
                  />
                </>
                )}
              </View>
              <Button
                isDisabled={phoneNr.length < 8}
                isLoading={regLoading || logLoading}
                text={i18n.t('Next')}
                onPress={requestCode}
              />
            </View>
            <View style={{ padding: 25 }}>
              <Headline
                type={4}
                text={i18n.t('We’ve sent you the code by SMS to')}
                color={COLORS.neutral[700]}
              />
              <Headline
                type={4}
                text={`+${countryCode} ${phoneNr}`}
                style={{ fontWeight: '600' }}
                color={COLORS.neutral[900]}
              />
              <View style={{
                width: 280, marginTop: 26, marginBottom: 20, alignSelf: 'center',
              }}
              >
                <CodeInput
                  value={code}
                  setValue={(val) => setCode(val)}
                />
              </View>
              <Body
                onPress={() => pageRef.current?.setPage(0)}
                type={2}
                style={{ textDecorationLine: 'underline', alignSelf: 'center' }}
                text={getTimerString()}
                color={COLORS.neutral[500]}
              />
            </View>
          </PagerView>

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
  },
});
