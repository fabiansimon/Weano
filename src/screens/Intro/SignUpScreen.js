import {
  Animated, View, StyleSheet, Image, Pressable,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
import TextField from '../../components/TextField';
import AuthModal from '../../components/AuthModal';
// import GoogleIcon from '../../../assets/icons/google_icon.svg';
import Button from '../../components/Button';
import REGEX from '../../constants/Regex';
import Logo from '../../../assets/images/logo_temp.png';
import ImageCollage from '../../../assets/images/intro_collage.png';
import Utils from '../../utils';
import WebViewModal from '../../components/WebViewModal';
import META_DATA from '../../constants/MetaData';
import SensorView from '../../components/SensorView';
import BackButton from '../../components/BackButton';
import KeyboardView from '../../components/KeyboardView';

const errorColors = {
  error: COLORS.error[700],
  success: COLORS.success[700],
  neutral: COLORS.neutral[300],
};

export default function SignUpScreen({ invitationId, route }) {
  // PARAMS
  const { uploadReminderId } = route.params;

  // STATE & MISC
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
  const lastNameRef = useRef();
  const emailRef = useRef();
  const [loginVisible, setLoginVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [initIntro, setInitIntro] = useState(false);
  const [webViewOption, setWebViewOption] = useState(null);

  // ANIMATIONS
  const animatedTranslateY = useRef(new Animated.Value(1000)).current;
  const animatedImageY = useRef(new Animated.Value(0)).current;
  const animatedBackButtonX = useRef(new Animated.Value(-100)).current;
  const duration = 300;

  useEffect(() => {
    if (initIntro) {
      Animated.spring(animatedTranslateY, {
        toValue: 50,
        duration,
      }).start();
      Animated.spring(animatedImageY, {
        toValue: -500,
        duration,
      }).start();
      Animated.spring(animatedBackButtonX, {
        toValue: 0,
        duration,
      }).start();
    } else {
      Animated.spring(animatedTranslateY, {
        toValue: 1000,
        duration,
      }).start();
      Animated.spring(animatedImageY, {
        toValue: 0,
        duration,
      }).start();
      Animated.spring(animatedBackButtonX, {
        toValue: -100,
        duration,
      }).start();
    }
  }, [initIntro]);

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
  };

  const getCheckList = () => (
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

  const getAuthContainer = () => (
    <Animated.View
      contentContainerStyle={{
        justifyContent: 'space-between', flex: 1, paddingBottom: 50,
      }}
      style={[styles.mainContainer, { transform: [{ translateY: animatedTranslateY }] }]}
    >
      <KeyboardView paddingBottom={65}>
        <>
          <Headline
            type={2}
            text={i18n.t('Sign up 👋')}
          />
          <Body
            style={{ marginTop: 4 }}
            color={COLORS.neutral[300]}
            type={1}
            text={i18n.t('Are you ready to make some memories?')}
          />
          <View style={{ marginTop: 20 }}>
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
                // autoFocus
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
          {getCheckList()}
        </>
        <View style={{
          width: '100%', height: 90, marginTop: 'auto',
        }}
        >
          <Button
            fullWidth
            onPress={() => setRegisterVisible(true)}
            text={i18n.t('Next')}
            isDisabled={!(errorChecks.firstName.isValid && errorChecks.lastName.isValid && errorChecks.email.isValid)}
          />
          {/* <Button
            style={{ marginTop: 15 }}
            fullWidth
            icon={<GoogleIcon height={22} style={{ left: -20 }} />}
            isSecondary
            onPress={() => console.log('Google')}
            text={i18n.t('Sign up with Google')}
          /> */}
          <Pressable
            onPress={() => setLoginVisible(true)}
            style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center' }}
          >
            <Body
              type={2}
              color={COLORS.neutral[300]}
              text={i18n.t('Already have an account?')}
            />
            <Body
              type={2}
              color={COLORS.primary[500]}
              text={i18n.t('Log in instead')}
              style={{ marginLeft: 4, fontWeight: '500' }}
            />
          </Pressable>
        </View>
      </KeyboardView>
    </Animated.View>

  );

  const AnimatedImage = Animated.createAnimatedComponent(Image);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary[700], justifyContent: 'space-between' }}>
      <SensorView>
        <AnimatedImage
          style={[{ width: '100%', height: 320 }, { transform: [{ translateY: animatedImageY }] }]}
          source={ImageCollage}
          resizeMode="cover"
        />
      </SensorView>
      <View style={{ marginHorizontal: PADDING.m }}>
        <Image
          source={Logo}
          style={{
            height: 50, width: 40, marginTop: 10,
          }}
        />
        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
          <Headline
            type={2}
            color={COLORS.shades[0]}
            style={{ marginRight: 4 }}
            text={i18n.t('Create,')}
          />
          <Headline
            type={2}
            color={COLORS.shades[0]}
            style={{ marginRight: 4 }}
            text={i18n.t('capture')}
          />
          <Headline
            type={2}
            style={{ fontWeight: '400', marginRight: 4 }}
            color={COLORS.shades[0]}
            text={i18n.t('and')}
          />
          <Headline
            type={2}
            color={COLORS.shades[0]}
            style={{ marginRight: 4 }}
            text={i18n.t('preserve')}
          />
          <Headline
            type={2}
            color={COLORS.shades[0]}
            style={{ marginRight: 4 }}
            text={i18n.t('moments')}
          />
          <Headline
            type={2}
            style={{ fontWeight: '400', marginRight: 4 }}
            color={COLORS.shades[0]}
            text={i18n.t('that')}
          />
          <Headline
            type={2}
            style={{ fontWeight: '400', marginRight: 4 }}
            color={COLORS.shades[0]}
            text={i18n.t('you')}
          />
          <Headline
            type={2}
            color={COLORS.shades[0]}
            style={{ fontWeight: '400', marginRight: 4 }}
            text={i18n.t('never')}
          />
          <Headline
            type={2}
            style={{ fontWeight: '400', marginRight: 4 }}
            color={COLORS.shades[0]}
            text={i18n.t('wanted')}
          />
          <Headline
            type={2}
            style={{ fontWeight: '400', marginRight: 4 }}
            color={COLORS.shades[0]}
            text={i18n.t('to')}
          />
          <Headline
            type={2}
            style={{ fontWeight: '400', marginRight: 4 }}
            color={COLORS.shades[0]}
            text={i18n.t('forget')}
          />
        </View>
        <Body
          type={2}
          style={{ marginTop: 10 }}
          color={COLORS.shades[0]}
          text={i18n.t('(Hey Sophia und Julia ihr hübschen 🇿🇦)')}
        />
        <View style={{
          width: '100%', height: 170, marginTop: '25%', marginBottom: 40,
        }}
        >
          <Button
            fullWidth
            textColor={COLORS.primary[900]}
            isSecondary
            onPress={() => setLoginVisible(true)}
            text={i18n.t('Log in')}
          />
          <Button
            fullWidth
            onPress={() => setInitIntro(true)}
            style={{ borderWidth: 1, borderColor: COLORS.shades[0], marginTop: 10 }}
            text={i18n.t('Sign up')}
          />
          <View
            style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}
          >
            <Body
              type={2}
              color={COLORS.shades[0]}
              text={i18n.t('By signing up you are agreeing to our')}
            />
            <View style={{ flexDirection: 'row' }}>
              <Body
                onPress={() => setWebViewOption('terms')}
                type={2}
                color={COLORS.shades[0]}
                style={{ fontWeight: '600' }}
                text={i18n.t('Terms')}
              />
              <Body
                type={2}
                color={COLORS.shades[0]}
                style={{ marginHorizontal: 2 }}
                text={i18n.t('and')}
              />
              <Body
                type={2}
                onPress={() => setWebViewOption('pp')}
                color={COLORS.shades[0]}
                style={{ fontWeight: '600' }}
                text={i18n.t('Privacy Policy')}
              />
            </View>
          </View>
        </View>
      </View>
      {getAuthContainer()}
      <Animated.View style={[{ position: 'absolute', top: 50, left: PADDING.m }, { transform: [{ translateX: animatedBackButtonX }] }]}>
        <BackButton
          onPress={() => setInitIntro(false)}
          isClear
          iconColor={COLORS.shades[0]}
        />
      </Animated.View>
      <AuthModal
        isVisible={registerVisible}
        onRequestClose={() => setRegisterVisible(false)}
        registerData={{
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
        }}
        joinTripId={invitationId}
        uploadReminderId={uploadReminderId}
      />
      <AuthModal
        isVisible={loginVisible}
        onRequestClose={() => setLoginVisible(false)}
        joinTripId={invitationId}
        uploadReminderId={uploadReminderId}
      />
      <WebViewModal
        isVisible={webViewOption !== null}
        onRequestClose={() => setWebViewOption(null)}
        url={webViewOption === 'pp' ? META_DATA.privacyPolicyUrl : META_DATA.termUrl}
        title={webViewOption === 'pp' ? i18n.t('Privacy Policy') : i18n.t('Terms & Conditions')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 50,
    backgroundColor: COLORS.shades[0],
    borderTopRightRadius: RADIUS.m,
    borderTopLeftRadius: RADIUS.m,
    paddingHorizontal: PADDING.l,
    paddingTop: PADDING.l,
    marginTop: 110,
    marginBottom: 50,
    position: 'absolute',
    width: '100%',
    height: '88%',
    bottom: 0,
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
