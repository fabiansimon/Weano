import {
  View, StyleSheet, Image, Pressable, ScrollView,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
import TextField from '../../components/TextField';
import AuthModal from '../../components/AuthModal';
import GoogleIcon from '../../../assets/icons/google_icon.svg';
import Button from '../../components/Button';
import REGEX from '../../constants/Regex';
import Logo from '../../../assets/images/logo_temp.png';
import Utils from '../../utils';

export default function SignUpScreen({ invitationId }) {
  const errorColors = {
    error: COLORS.error[700],
    success: COLORS.success[700],
    neutral: COLORS.neutral[300],
  };
  const lastNameRef = useRef();
  const emailRef = useRef();
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [allValid, setAllValid] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errorChecks, setErrorChecks] = useState(
    {
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
    },
  );

  useEffect(() => {
    checkForErrors();
  }, [firstName, lastName, email]);

  const checkForErrors = () => {
    // First Name checks
    if (firstName.length === 0) {
      setErrorChecks((prev) => ({
        ...prev,
        firstName: {
          error: i18n.t('missing'),
          color: errorColors.neutral,
        },
      }));
    } else if (REGEX.name.test(firstName.trim())) {
      setErrorChecks((prev) => ({
        ...prev,
        firstName: {
          error: i18n.t('contains invalid characters'),
          color: errorColors.error,
        },
      }));
    } else {
      setErrorChecks((prev) => ({
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
      setErrorChecks((prev) => ({
        ...prev,
        lastName: {
          error: i18n.t('missing'),
          color: errorColors.neutral,
        },
      }));
    } else if (REGEX.name.test(lastName.trim())) {
      setErrorChecks((prev) => ({
        ...prev,
        lastName: {
          error: i18n.t('contains invalid characters'),
          color: errorColors.error,
        },
      }));
    } else {
      setErrorChecks((prev) => ({
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
      setErrorChecks((prev) => ({
        ...prev,
        email: {
          error: i18n.t('missing'),
          color: errorColors.neutral,
        },
      }));
    } else if (!email.toLowerCase().match(REGEX.email)) {
      setErrorChecks((prev) => ({
        ...prev,
        email: {
          error: i18n.t('is not a valid email'),
          color: errorColors.error,
        },
      }));
    } else {
      setErrorChecks((prev) => ({
        ...prev,
        email: {
          error: i18n.t('is valid'),
          color: errorColors.success,
          isValid: true,
        },
      }));
    }

    setAllValid(errorChecks.firstName.isValid && errorChecks.lastName.isValid && errorChecks.email.isValid);
  };

  const CheckList = () => (
    <View style={{ marginTop: 10 }}>
      {!errorChecks.firstName.isValid && firstName?.length >= 1
        && (
        <Body
          type={2}
          color={errorChecks.firstName.color}
          text={`• ${i18n.t('First name')} ${errorChecks.firstName.error}`}
        />
        )}
      {!errorChecks.lastName.isValid && lastName?.length >= 1
      && (
      <Body
        type={2}
        color={errorChecks.lastName.color}
        text={`• ${i18n.t('Last name')} ${errorChecks.lastName.error}`}
      />
      )}
      {!errorChecks.email.isValid && email?.length >= 1
      && (
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
      <View style={styles.header}>
        <SafeAreaView
          style={styles.innerHeaderContainer}
        >
          <Image
            source={Logo}
            style={{ height: 50, width: 59 }}
            resizeMode="cover"
          />
          <Pressable
            onPress={() => setLoginVisible(true)}
            style={styles.loginContainer}
          >
            <Body
              type={1}
              color={COLORS.shades[0]}
              text={i18n.t('Log in instead')}
            />
          </Pressable>
        </SafeAreaView>
      </View>
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{ justifyContent: 'space-between', flex: 1 }}
        style={styles.mainContainer}
      >
        <>
          <Headline
            type={2}
            text={i18n.t('Hey there 👋')}
          />
          <Body
            style={{ marginTop: 4 }}
            color={COLORS.neutral[300]}
            type={1}
            text={i18n.t('Are you ready to make some memories? \nIf not, then better get ready! ')}
          />
          <View style={{ marginTop: 30 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Body
                  color={COLORS.neutral[700]}
                  type={2}
                  style={{ marginBottom: 6, marginLeft: 5 }}
                  text={i18n.t('First name')}
                />
                <TextField
                  onDelete={() => setFirstName('')}
                  autoFocus
                  returnKeyType="next"
                  label={i18n.t('First name')}
                  value={firstName || null}
                  onChangeText={(val) => setFirstName(val)}
                  style={firstName.length > 0 ? errorChecks.firstName.isValid ? styles.validField : styles.invalidField : null}
                  placeholder={i18n.t('John')}
                  autoComplete={false}
                  autoCorrect
                />
              </View>

              <View style={{ flex: 1 }}>
                <Body
                  color={COLORS.neutral[700]}
                  type={2}
                  style={{ marginBottom: 6, marginLeft: 5 }}
                  text={i18n.t('Last name')}
                />
                <TextField
                  ref={lastNameRef}
                  onDelete={() => setLastName('')}
                  returnKeyType="next"
                  label={i18n.t('Last name')}
                  style={lastName.length > 0 ? errorChecks.lastName.isValid ? styles.validField : styles.invalidField : null}
                  value={lastName || null}
                  onChangeText={(val) => setLastName(val)}
                  placeholder={i18n.t('Doe')}
                  autoComplete={false}
                  autoCorrect={false}
                />
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              <Body
                color={COLORS.neutral[700]}
                type={2}
                style={{ marginBottom: 6, marginLeft: 5 }}
                text={i18n.t('Email')}
              />
              <TextField
                ref={emailRef}
                onDelete={() => setEmail('')}
                keyboardType="email-address"
                autoCapitalize={false}
                label={i18n.t('Email')}
                value={email || null}
                returnKeyType="done"
                autoComplete={false}
                style={email.length > 0 ? errorChecks.email.isValid ? styles.validField : styles.invalidField : null}
                autoCorrect={false}
                onChangeText={(val) => setEmail(val)}
                placeholder={i18n.t('Your Email')}
              />
            </View>
          </View>
          <CheckList />
        </>
        <View style={{
          width: '100%', height: 115, marginTop: 'auto',
        }}
        >
          <Button
            fullWidth
            onPress={() => setRegisterVisible(true)}
            text={i18n.t('Next')}
            isDisabled={!allValid}
          />
          <Button
            style={{ marginTop: 15 }}
            fullWidth
            icon={<GoogleIcon height={22} style={{ left: -20 }} />}
            isSecondary
            onPress={() => console.log('Google')}
            text={i18n.t('Sign up with Google')}
          />
        </View>
      </ScrollView>
      <AuthModal
        isVisible={registerVisible}
        onRequestClose={() => setRegisterVisible(false)}
        registerData={{
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
        }}
      />
      <AuthModal
        isVisible={loginVisible}
        onRequestClose={() => setLoginVisible(false)}
        joinTripId={invitationId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    backgroundColor: COLORS.primary[500],
    width: '100%',
    height: 200,
  },
  loginContainer: {
    backgroundColor: COLORS.primary[300],
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 100,
  },
  innerHeaderContainer: {
    marginTop: 8,
    marginBottom: -20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: PADDING.s,
  },
  mainContainer: {
    backgroundColor: COLORS.shades[0],
    borderTopRightRadius: RADIUS.m,
    borderTopLeftRadius: RADIUS.m,
    paddingHorizontal: PADDING.l,
    paddingTop: PADDING.l,
    height: 100,
    marginTop: 120,
    paddingBottom: 50,
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
