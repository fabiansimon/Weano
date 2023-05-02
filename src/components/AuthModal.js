import {View, StyleSheet, Keyboard, Platform} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PagerView from 'react-native-pager-view';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-toast-message';
import TitleModal from './TitleModal';
import i18n from '../utils/i18n';
import Headline from './typography/Headline';
import COLORS, {PADDING} from '../constants/Theme';
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
import httpService from '../utils/httpService';
import userStore from '../stores/UserStore';
import Utils from '../utils';
import CountrySelectorModal from './CountrySelectorModal';
import CountryData from '../constants/Countries';
import moment from 'moment';

const asyncStorageDAO = new AsyncStorageDAO();

export default function AuthModal({
  isVisible,
  onRequestClose,
  registerData,
  inviteId,
  onRegisterPress,
}) {
  // MUTATIONS
  const [registerUser] = useMutation(REGISTER_USER);
  const [loginUser] = useMutation(LOGIN_USER);

  // STORES
  const updateUserData = userStore(state => state.updateUserData);

  // STATE & MISC
  const [phoneNr, setPhoneNr] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [code, setCode] = useState('');
  const [country, setCountry] = useState(
    CountryData.find(c => c.name === 'Austria'),
  );
  const pageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const isLogin = !registerData;

  useEffect(() => {
    if (code.length === 4) {
      if (!isLogin) {
        handleRegister();
        return;
      }
      handleLogin();
    }
  }, [code]);

  useEffect(() => {
    setPhoneNr('');
    setPickerVisible(false);
    setCode('');
    setCountry(CountryData.find(c => c.name === 'Austria'));
  }, [onRequestClose]);

  const navigatePage = index => {
    Keyboard.dismiss();

    setTimeout(() => {
      pageRef.current?.setPage(index);
    }, 100);
  };

  const checkCodeAttemps = async () => {
    const codeUsage = await asyncStorageDAO.getCodeUsage();

    if (!codeUsage) {
      asyncStorageDAO.setCodeUsage(
        JSON.stringify({
          attempt: 1,
          day: moment(new Date()).startOf('day'),
        }),
      );

      return true;
    }

    const {attempt, day} = JSON.parse(codeUsage);
    const today = moment(new Date()).startOf('day');

    if (new Date(day) * 1 === new Date(today) * 1 && attempt > 2) {
      Toast.show({
        type: 'error',
        text1: i18n.t('Whoops!'),
        text2: i18n.t(
          'You have exceeded your daily limit for code verifications ',
        ),
      });
      return false;
    }

    asyncStorageDAO.setCodeUsage(
      JSON.stringify({
        attempt: attempt + 1,
        day: moment(new Date()).startOf('day'),
      }),
    );

    return true;
  };

  const requestCode = async () => {
    if (!(await checkCodeAttemps())) {
      return;
    }

    setIsLoading(true);
    navigatePage(1);
    const phoneNumber = `+${country.dialCode}${phoneNr.trim()}`;
    await httpService
      .getVerificationCode(phoneNumber)
      .then(res => {
        if (res.status === 'pending') {
          pageRef.current?.setPage(1);
          setIsLoading(false);
        }
      })
      .catch(err => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: err.message,
        });
        pageRef.current?.setPage(0);
        setIsLoading(false);
      });
  };

  const checkCode = async () => {
    setIsLoading(true);
    const phoneNumber = `${country.dialCode}${phoneNr.trim()}`;
    const res = await httpService
      .checkVerificationCode(phoneNumber, code)
      .catch(err =>
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: err.message,
        }),
      );

    // return res.status;
    return 'approved';
  };

  const handleRegister = async () => {
    const {email, firstName, lastName} = registerData;
    const phoneNumber = `${country.dialCode}${phoneNr.trim()}`;

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
    })
      .catch(e => {
        navigatePage(0);
        setCode('');
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
      })
      .then(res => {
        asyncStorageDAO.setAccessToken(res.data.registerUser);
        updateUserData({authToken: res.data.registerUser});

        navigation.push(ROUTES.initDataCrossroads, {
          inviteId: inviteId || null,
        });
        onRequestClose();
      });
  };

  const handleLogin = async () => {
    const phoneNumber = `${country.dialCode}${phoneNr.trim()}`;
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
    })
      .catch(e => {
        navigatePage(0);
        setCode('');
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        console.log(e);
      })
      .then(res => {
        asyncStorageDAO.setAccessToken(res.data.loginUser);
        updateUserData({authToken: res.data.loginUser});

        navigation.push(ROUTES.initDataCrossroads, {
          inviteId: inviteId || null,
        });
        onRequestClose();
      });
  };

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={isLogin ? i18n.t('Log in') : i18n.t('Authenticate')}>
      <KeyboardView
        behavior="padding"
        paddingBottom={Platform.OS === 'android' ? 10 : 40}>
        <View style={styles.container}>
          <PagerView style={{flex: 1}} ref={pageRef} scrollEnabled={false}>
            <View
              style={{
                padding: PADDING.l,
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <View>
                <Headline
                  type={4}
                  text={i18n.t('Phone number')}
                  color={COLORS.neutral[700]}
                />
                <TextField
                  keyboardType="phone-pad"
                  style={{marginTop: 18, marginBottom: 10}}
                  prefix={country.flag}
                  dialCode={country.dialCode}
                  onPrefixPress={() => setPickerVisible(true)}
                  value={phoneNr || null}
                  onChangeText={val => setPhoneNr(val)}
                  placeholder={i18n.t('123 45 56')}
                  onDelete={() => setPhoneNr('')}
                />
                <Body
                  type={2}
                  text={i18n.t(
                    'We will confirm your number via text. Standard message and data rates apply',
                  )}
                  color={COLORS.neutral[300]}
                />
                {isLogin && (
                  <>
                    <Divider vertical={14} />
                    <Body
                      type={2}
                      text={i18n.t('No account yet?')}
                      color={COLORS.neutral[300]}
                    />
                    <Headline
                      type={4}
                      onPress={() => {
                        onRequestClose();
                        setCode('');
                        setPhoneNr('');
                        onRegisterPress();
                      }}
                      style={{marginTop: 6, textDecorationLine: 'underline'}}
                      text={i18n.t('Register')}
                      color={COLORS.neutral[700]}
                    />
                  </>
                )}
              </View>
              <Button
                // isDisabled={phoneNr.length < 8}
                isLoading={false}
                fullWidth
                text={i18n.t('Next')}
                onPress={() => {
                  requestCode();
                }}
              />
            </View>
            <View style={{padding: PADDING.l}}>
              <Headline
                type={4}
                text={i18n.t('We’ve sent you the code by SMS to')}
                color={COLORS.neutral[700]}
              />
              <Headline
                type={4}
                text={`${country.dialCode} ${phoneNr}`}
                style={{fontWeight: Platform.OS === 'android' ? '700' : '600'}}
                color={COLORS.neutral[900]}
              />
              <View
                style={{
                  width: 280,
                  marginTop: 26,
                  marginBottom: 20,
                  alignSelf: 'center',
                }}>
                <CodeInput value={code} setValue={val => setCode(val)} />
              </View>
              <Body
                type={1}
                onPress={() =>
                  Utils.showConfirmationAlert(
                    i18n.t('Retry'),
                    i18n.t(
                      "Let's take a look at your phone number, and then we will try again.",
                    ),
                    i18n.t('Go back'),
                    () => {
                      setCode('');
                      navigatePage(0);
                    },
                    false,
                  )
                }
                text={i18n.t('Did not receive a code?')}
                style={{
                  textDecorationLine: 'underline',
                  marginTop: 8,
                  alignSelf: 'center',
                }}
                color={COLORS.neutral[300]}
              />
            </View>
          </PagerView>
        </View>
      </KeyboardView>
      <CountrySelectorModal
        onRequestClose={() => setPickerVisible(false)}
        isVisible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        selectedCountry={country}
        onPress={c => setCountry(c)}
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
