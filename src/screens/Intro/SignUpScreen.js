import {
  View, StyleSheet, SafeAreaViewBase, ScrollView,
} from 'react-native';
import React, { useState, useRef } from 'react';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS, { PADDING } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import PollView from '../../components/Polls/PollView';
import Headline from '../../components/typography/Headline';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import AddSuggestionModal from '../../components/Trip/AddSuggestionModal';
import BoardingPassModal from '../../components/Trip/BoardingPassModal';
import HighlightContainer from '../../components/Trip/HighlightContainer';
import Body from '../../components/typography/Body';
import TextField from '../../components/TextField';
import Divider from '../../components/Divider';
import AuthModal from '../../components/AuthModal';
import KeyboardView from '../../components/KeyboardView';
import Button from '../../components/Button';

export default function SignUpScreen() {
  const errorColors = {
    error: COLORS.error[900],
    success: COLORS.success[700],
    neutral: COLORS.neutral[300],
  };
  const [isVisible, setIsVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errorChecks, setErrorChecks] = useState([
    {
      firstName: {
        error: i18n.t('missing'),
        color: errorColors.neutral,
      },
    },
  ]);

  const CheckList = () => (
    <View style={{ marginBottom: 10 }}>
      <Body
        type={2}
        text={`• ${i18n.t('First name')}`}
      />
      <Body
        type={2}
        text={`• ${i18n.t('Last name')}`}
      />
      <Body
        type={2}
        text={`• ${i18n.t('Email')}`}
      />
    </View>
  );

  return (

    <KeyboardView>
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
              onPress={() => setIsVisible(true)}
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
                  label={i18n.t('First name')}
                  value={firstName || null}
                  onChangeText={(val) => setFirstName(val)}
                  placeholder={i18n.t('John')}
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
                  label={i18n.t('Last name')}
                  value={lastName || null}
                  onChangeText={(val) => setLastName(val)}
                  placeholder={i18n.t('Doe')}
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
                label={i18n.t('Email')}
                value={email || null}
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
              onPress={() => setIsVisible(true)}
              text={i18n.t('Next')}
            />
          </View>
        </View>
      </SafeAreaView>
      <AuthModal
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        isRegister
      />
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: PADDING.l,
  },
  footer: {
    marginHorizontal: PADDING.l,
  },
});
