import { View, StyleSheet } from 'react-native';
import React, { useState, useRef } from 'react';
import Animated from 'react-native-reanimated';
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
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const InputContainer = () => (
    <View style={{ marginHorizontal: PADDING.l, marginTop: 42 }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
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
            style={{ marginBottom: 6, marginLeft: 5 }}
            type={2}
            text={i18n.t('Last name')}
          />
          <TextField
            value={lastName || null}
            onChangeText={(val) => setLastName(val)}
            placeholder={i18n.t('Doe')}
          />
        </View>
      </View>
      <Divider vertical={16} />
      <View style={{ flex: 1 }}>
        <Body
          color={COLORS.neutral[700]}
          style={{ marginBottom: 6, marginLeft: 5 }}
          type={2}
          text={i18n.t('Email')}
        />
        <TextField
          onChangeText={(val) => setEmail(val)}
          value={email || null}
          placeholder={i18n.t('john-doe@email.com')}
        />
      </View>
    </View>
  );

  const CheckList = () => {
    const checkColors = {
      error: COLORS.error[900],
      success: COLORS.success[700],
      neutral: COLORS.neutral[300],
    };

    return (
      <View>
        <Body
          type={2}
          text={`• ${i18n.t('First name')} ${[0].}`}
        />
        <Body
          type={2}
          text="• First name is valid"
        />
        <Body
          type={2}
          text="• First name is valid"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Sign up')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
        backButton={false}
        backgroundColor={COLORS.neutral[50]}
        content={(
          <View style={{ flexDirection: 'row', marginLeft: PADDING.l, marginTop: -12 }}>
            <Body text={i18n.t('Already have an account?')} />
            <Body
              style={{ marginHorizontal: 3 }}
              text={i18n.t('Click')}
            />
            <Body
              onPress={() => setIsVisible(1)}
              text={i18n.t('here')}
              style={{ textDecorationLine: 'underline', fontWeight: '500' }}
            />
          </View>
)}
      >
        <KeyboardView>
          <InputContainer />
          <View style={{ marginHorizontal: PADDING.l }}>
            <CheckList />
            <Button
              text={i18n.t('Next')}
              fullWidth
              onPress={() => setIsVisible(2)}
            />
          </View>
        </KeyboardView>
      </HybridHeader>
      <AuthModal
        isVisible={isVisible === 1 || isVisible === 2}
        onRequestClose={() => setIsVisible(false)}
        isRegister
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
});
