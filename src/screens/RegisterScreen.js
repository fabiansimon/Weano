import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import COLORS, {PADDING} from '../constants/Theme';
import i18n from '../utils/i18n';
import REGEX from '../constants/Regex';
import Toast from 'react-native-toast-message';
import Body from '../components/typography/Body';
import Headline from '../components/typography/Headline';
import TextField from '../components/TextField';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import Utils from '../utils';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebViewModal from '../components/WebViewModal';
import META_DATA from '../constants/MetaData';
import AuthModal from '../components/AuthModal';
import GoogleIcon from '../../assets/icons/google_icon.svg';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useMutation} from '@apollo/client';
import REGISTER_USER from '../mutations/registerUser';
import AsyncStorageDAO from '../utils/AsyncStorageDAO';
import {useNavigation} from '@react-navigation/native';
import userStore from '../stores/UserStore';
import ROUTES from '../constants/Routes';
import * as AppleAuthentication from 'expo-apple-authentication';

const asyncStorageDAO = new AsyncStorageDAO();

GoogleSignin.configure({
  webClientId:
    '1011261400246-ora3gsn0hfhqhmethp3jt57tlma07ttf.apps.googleusercontent.com',
});

const errorColors = {
  error: COLORS.error[700],
  success: COLORS.success[700],
  neutral: COLORS.neutral[300],
};

export default function RegisterScreen({route}) {
  // PARAMS
  const {uploadReminderId, inviteId} = route.params;

  // MUTATIONS
  const [registerUser] = useMutation(REGISTER_USER);

  // STORES
  const updateUserData = userStore(state => state.updateUserData);

  // STATE & MISC
  const [errorChecks, setErrorChecks] = useState({
    firstName: {
      error: i18n.t('missing'),
      color: errorColors.neutral,
      isValid: false,
    },
    lastName: {
      error: i18n.t('missing'),
      color: errorColors.neutral,
      isValid: false,
    },
    email: {
      error: i18n.t('missing'),
      color: errorColors.neutral,
      isValid: false,
    },
  });
  const lastNameRef = useRef();
  const emailRef = useRef();
  const [registerVisible, setRegisterVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [webViewOption, setWebViewOption] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    checkForErrors();
  }, [firstName, lastName, email]);

  const handleAuthApple = async () => {
    try {
      const {
        email: appleEmail,
        fullName: {familyName, givenName},
        identityToken,
      } = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      await registerUser({
        variables: {
          user: {
            appleIdToken: identityToken,
            firstName: givenName,
            lastName: familyName,
            email: appleEmail,
          },
        },
      })
        .catch(e => {
          console.log(e);
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
        })
        .then(res => {
          if (!res) {
            return;
          }
          asyncStorageDAO.setAccessToken(res.data.registerUser);
          updateUserData({authToken: res.data.registerUser});
          navigation.push(ROUTES.initDataCrossroads, registerUser);
        });
      // signed in
    } catch (e) {
      console.error(e);
    }
  };

  const handleAuthGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken: googleIdToken} = await GoogleSignin.signIn();

      await registerUser({
        variables: {
          user: {
            googleIdToken,
          },
        },
      })
        .catch(e => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e,
          });
        })
        .then(res => {
          asyncStorageDAO.setAccessToken(res.data.registerUser);
          updateUserData({authToken: res.data.registerUser});
          navigation.push(ROUTES.initDataCrossroads, {
            inviteId: inviteId || null,
          });
        });
    } catch (e) {
      console.log(e);
    }
  };

  const checkForErrors = () => {
    // First Name checks
    if (firstName.length === 0) {
      setErrorChecks(prev => ({
        ...prev,
        firstName: {
          error: i18n.t('missing'),
          color: errorColors.neutral,
        },
      }));
    } else if (REGEX.name.test(firstName.trim())) {
      setErrorChecks(prev => ({
        ...prev,
        firstName: {
          error: i18n.t('contains invalid characters'),
          color: errorColors.error,
        },
      }));
    } else {
      setErrorChecks(prev => ({
        ...prev,
        firstName: {
          error: i18n.t('is valid'),
          color: errorColors.success,
          isValid: true,
        },
      }));
    }

    // Last Name checks
    if (lastName.length === 0) {
      setErrorChecks(prev => ({
        ...prev,
        lastName: {
          error: i18n.t('missing'),
          color: errorColors.neutral,
        },
      }));
    } else if (REGEX.name.test(lastName.trim())) {
      setErrorChecks(prev => ({
        ...prev,
        lastName: {
          error: i18n.t('contains invalid characters'),
          color: errorColors.error,
        },
      }));
    } else {
      setErrorChecks(prev => ({
        ...prev,
        lastName: {
          error: i18n.t('is valid'),
          color: errorColors.success,
          isValid: true,
        },
      }));
    }

    // Email checks
    if (email.length === 0) {
      setErrorChecks(prev => ({
        ...prev,
        email: {
          error: i18n.t('missing'),
          color: errorColors.neutral,
        },
      }));
    } else if (!email.toLowerCase().match(REGEX.email)) {
      setErrorChecks(prev => ({
        ...prev,
        email: {
          error: i18n.t('is not a valid email'),
          color: errorColors.error,
        },
      }));
    } else {
      setErrorChecks(prev => ({
        ...prev,
        email: {
          error: i18n.t('is valid'),
          color: errorColors.success,
          isValid: true,
        },
      }));
    }
  };

  const getCheckList = () => (
    <View style={{marginTop: 10}}>
      {!errorChecks.firstName.isValid && firstName?.length >= 1 && (
        <Body
          type={2}
          color={errorChecks.firstName.color}
          text={`• ${i18n.t('First name')} ${errorChecks.firstName.error}`}
        />
      )}
      {!errorChecks.lastName.isValid && lastName?.length >= 1 && (
        <Body
          type={2}
          color={errorChecks.lastName.color}
          text={`• ${i18n.t('Last name')} ${errorChecks.lastName.error}`}
        />
      )}
      {!errorChecks.email.isValid && email?.length >= 1 && (
        <Body
          type={2}
          color={errorChecks.email.color}
          text={`• ${i18n.t('Email')} ${errorChecks.email.error}`}
        />
      )}
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={[styles.mainContainer]}>
        <>
          <BackButton isClear />
          <Headline
            type={2}
            text={i18n.t('Sign up 👋')}
            style={{marginTop: 10}}
          />
          <Body
            style={{marginTop: 4}}
            color={COLORS.neutral[300]}
            type={1}
            text={i18n.t('Are you ready to make some memories?')}
          />
          <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, paddingRight: 8}}>
                <Body
                  color={COLORS.neutral[700]}
                  type={2}
                  style={{marginBottom: 6, marginLeft: 5}}
                  text={i18n.t('First name')}
                />
                <TextField
                  onDelete={() => setFirstName('')}
                  returnKeyType="next"
                  label={i18n.t('First name')}
                  value={firstName || null}
                  onChangeText={val => setFirstName(val)}
                  style={
                    firstName.length > 0
                      ? errorChecks.firstName.isValid
                        ? styles.validField
                        : styles.invalidField
                      : null
                  }
                  placeholder={i18n.t('John')}
                />
              </View>

              <View style={{flex: 1}}>
                <Body
                  color={COLORS.neutral[700]}
                  type={2}
                  style={{marginBottom: 6, marginLeft: 5}}
                  text={i18n.t('Last name')}
                />
                <TextField
                  ref={lastNameRef}
                  onDelete={() => setLastName('')}
                  returnKeyType="next"
                  label={i18n.t('Last name')}
                  style={
                    lastName.length > 0
                      ? errorChecks.lastName.isValid
                        ? styles.validField
                        : styles.invalidField
                      : null
                  }
                  value={lastName || null}
                  onChangeText={val => setLastName(val)}
                  placeholder={i18n.t('Doe')}
                />
              </View>
            </View>
            <View style={{marginTop: 12}}>
              <Body
                color={COLORS.neutral[700]}
                type={2}
                style={{marginBottom: 6, marginLeft: 5}}
                text={i18n.t('Email')}
              />
              <TextField
                ref={emailRef}
                autoCorrect={false}
                onDelete={() => setEmail('')}
                keyboardType="email-address"
                label={i18n.t('Email')}
                value={email || null}
                returnKeyType="done"
                style={
                  email.length > 0
                    ? errorChecks.email.isValid
                      ? styles.validField
                      : styles.invalidField
                    : null
                }
                autoCapitalize="none"
                onChangeText={val => setEmail(val)}
                placeholder={i18n.t('Your Email')}
              />
            </View>
          </View>
          {getCheckList()}
        </>
        <View style={{marginTop: 'auto'}}>
          <View
            style={{
              width: '100%',
              height: 50,
              marginBottom: 6,
            }}>
            <Button
              isSecondary
              icon={<GoogleIcon />}
              fullWidth
              onPress={handleAuthGoogle}
              text={i18n.t('Sign up with Google')}
            />
          </View>
          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={100}
              style={{
                height: 48,
                marginBottom: 6,
              }}
              onPress={handleAuthApple}
            />
          )}

          <Body
            type={2}
            text={i18n.t('Or')}
            style={{marginBottom: 6, alignSelf: 'center'}}
            color={COLORS.neutral[300]}
          />
          <View
            style={{
              width: '100%',
              height: 50,
            }}>
            <Button
              fullWidth
              onPress={() => setRegisterVisible(true)}
              text={i18n.t('Sign up with phone')}
              isDisabled={
                !(
                  errorChecks.firstName.isValid &&
                  errorChecks.lastName.isValid &&
                  errorChecks.email.isValid
                )
              }
            />
          </View>
        </View>
        <View
          style={{
            marginTop: 14,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Body
            type={2}
            color={COLORS.neutral[700]}
            text={i18n.t('By signing up you are agreeing to our')}
          />
          <View style={{flexDirection: 'row'}}>
            {/* <Body
              onPress={() => setWebViewOption('terms')}
              type={2}
              color={COLORS.shades[100]}
              style={{
                fontWeight: Platform.OS === 'android' ? '700' : '600',
              }}
              text={i18n.t('Terms')}
            />
            <Body
              type={2}
              color={COLORS.neutral[700]}
              style={{marginHorizontal: 2}}
              text={i18n.t('and')}
            /> */}
            <Body
              type={2}
              onPress={() => setWebViewOption('pp')}
              color={COLORS.shades[100]}
              style={{
                fontWeight: Platform.OS === 'android' ? '700' : '600',
              }}
              text={i18n.t('Privacy Policy')}
            />
          </View>
        </View>
      </SafeAreaView>
      <AuthModal
        isVisible={registerVisible}
        onRequestClose={() => setRegisterVisible(false)}
        registerData={{
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
        }}
        joinTripId={inviteId}
        uploadReminderId={uploadReminderId}
      />
      <WebViewModal
        isVisible={webViewOption !== null}
        onRequestClose={() => setWebViewOption(null)}
        url={
          webViewOption === 'pp'
            ? META_DATA.privacyPolicyUrl
            : META_DATA.termUrl
        }
        title={
          webViewOption === 'pp'
            ? i18n.t('Privacy Policy')
            : i18n.t('Terms & Conditions')
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: COLORS.shades[0],
    paddingHorizontal: PADDING.l,
    paddingVertical: Platform.OS === 'android' ? 20 : 0,
  },
  validField: {
    borderWidth: 1,
    borderColor: COLORS.success[500],
    backgroundColor: Utils.addAlpha(COLORS.success[500], 0.1),
  },
  invalidField: {
    borderWidth: 1,
    borderColor: COLORS.error[500],
    backgroundColor: Utils.addAlpha(COLORS.error[500], 0.1),
  },
});
