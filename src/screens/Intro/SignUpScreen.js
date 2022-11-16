import {
  View, StyleSheet,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
import TextField from '../../components/TextField';
import AuthModal from '../../components/AuthModal';
import KeyboardView from '../../components/KeyboardView';
import Button from '../../components/Button';

export default function SignUpScreen({ invitationId }) {
  const errorColors = {
    error: COLORS.error[900],
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

  // eslint-disable-next-line no-useless-escape
  const nameReg = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    } else if (nameReg.test(firstName.trim())) {
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
    } else if (nameReg.test(lastName.trim())) {
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
    } else if (!email.toLowerCase().match(emailReg)) {
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
    <View style={{ marginBottom: 20 }}>
      <Body
        type={2}
        color={errorChecks.firstName.color}
        text={`• ${i18n.t('First name')} ${errorChecks.firstName.error}`}
      />
      <Body
        type={2}
        color={errorChecks.lastName.color}
        text={`• ${i18n.t('Last name')} ${errorChecks.lastName.error}`}
      />
      <Body
        type={2}
        color={errorChecks.email.color}
        text={`• ${i18n.t('Email')} ${errorChecks.email.error}`}
      />
    </View>
  );

  return (

    <KeyboardView paddingBottom={-30}>
      <SafeAreaView style={{ backgroundColor: COLORS.neutral[50], flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.container}>
          <Headline
            text={i18n.t('Sign up!')}
            type={2}
          />
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <Body text={i18n.t('Already have an account?')} />
            <Body
              style={{ marginHorizontal: 3 }}
              text={i18n.t('Click')}
            />
            <Body
              onPress={() => {
                setLoginVisible(true);
              }}
              text={i18n.t('here')}
              style={{ textDecorationLine: 'underline', fontWeight: '500' }}
            />

          </View>
          <View style={{ marginTop: 42 }}>
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
                autoCorrect={false}
                onChangeText={(val) => setEmail(val)}
                placeholder={i18n.t('Your Email')}
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <CheckList />
          <View style={{ width: '100%', height: 60 }}>
            <Button
              fullWidth
              onPress={() => setRegisterVisible(true)}
              text={i18n.t('Next')}
              isDisabled={!allValid}
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
      />
      <AuthModal
        isVisible={loginVisible}
        onRequestClose={() => setLoginVisible(false)}
        joinTripId={invitationId}
      />
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginHorizontal: PADDING.l,
  },
  footer: {
    marginHorizontal: PADDING.l,
  },
});
