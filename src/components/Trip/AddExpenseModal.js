import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import TitleModal from '../TitleModal';
import KeyboardView from '../KeyboardView';
import Button from '../Button';
import i18n from '../../utils/i18n';
import Headline from '../typography/Headline';
import COLORS, { PADDING } from '../../constants/Theme';
import Subtitle from '../typography/Subtitle';

export default function AddExpenseModal({
  isVisible, onRequestClose, onPress, isLoading,
}) {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');

  const showWarning = (message) => {
    Toast.show({
      type: 'warning',
      text1: i18n.t('Whoops!'),
      text2: message,
    });
  };

  const handlePress = () => {
    const regVal = /^[0-9]*(,[0-9]{0,2})?$/;
    const amountString = amount.toString();

    if (amountString.length <= 0) {
      showWarning(i18n.t('Please enter an amount first.'));
      return;
    }

    if (amountString.includes(',')) {
      if (!regVal.test(amountString)) {
        showWarning(i18n.t('Your amount is not valid'));
        return;
      }
    }

    if (title.trim().length <= 0) {
      showWarning(i18n.t('Please enter a description'));
      return;
    }
    onPress({ amount, title });
  };

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Expense')}
      actionLabel={i18n.t('Create')}
      onPress={handlePress}
      isLoading={isLoading}
      isDisabled={amount.length <= 0 || title.length <= 0}
    >
      <KeyboardView paddingBottom={50}>
        <View style={styles.container}>
          <View>
            <View style={styles.amountContainer}>
              <Headline
                type={4}
                text={i18n.t('Amount')}
                color={COLORS.neutral[300]}
              />
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 12 }}>
                <Headline
                  type={2}
                  style={{
                    marginBottom: 6, marginRight: 6, fontWeight: '400', fontSize: 24,
                  }}
                  text="$"
                  color={amount && amount.length !== 0 ? COLORS.shades[100] : COLORS.neutral[100]}
                />
                <TextInput
                  onChangeText={(val) => setAmount(val)}
                  keyboardType="numeric"
                  style={styles.amountInput}
                  placeholderTextColor={COLORS.neutral[100]}
                  placeholder={i18n.t('150')}
                />
              </View>
            </View>
            <View style={styles.descriptionContainer}>
              <Subtitle
                type={1}
                style={{ marginLeft: PADDING.xl }}
                color={COLORS.neutral[300]}
                text={i18n.t('Expense description')}
              />
              <TextInput
                onChangeText={(val) => setTitle(val)}
                style={styles.descriptionInput}
                placeholderTextColor={COLORS.neutral[100]}
                placeholder={i18n.t('Birthday Cake 🎂')}
              />
            </View>
          </View>

        </View>
      </KeyboardView>
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  amountContainer: {
    alignItems: 'center',
    marginTop: 30,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  amountInput: {
    fontSize: 62,
    fontFamily: 'WorkSans-Regular',
    height: 60,
    letterSpacing: -1,
    borderBottomColor: COLORS.neutral[100],
  },
  descriptionContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
  },
  descriptionInput: {
    paddingLeft: PADDING.xl,
    marginTop: 10,
    fontSize: 20,
    fontFamily: 'WorkSans-Regular',
    letterSpacing: -1,
  },
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
});
