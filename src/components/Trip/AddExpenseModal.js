import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import TitleModal from '../TitleModal';
import KeyboardView from '../KeyboardView';
import Button from '../Button';
import i18n from '../../utils/i18n';
import Headline from '../typography/Headline';
import COLORS, { PADDING } from '../../constants/Theme';
import Subtitle from '../typography/Subtitle';

export default function AddExpenseModal({ isVisible, onRequestClose, onPress }) {
  const [amount, setAmount] = useState();
  const [description, setDescription] = useState('');

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      title={i18n.t('Add Expense')}
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
                onChangeText={(val) => setDescription(val)}
                style={styles.descriptionInput}
                placeholderTextColor={COLORS.neutral[100]}
                placeholder={i18n.t('Birthday Cake 🎂')}
              />
            </View>
          </View>
          <Button
            text={i18n.t('Add Expense')}
            style={{ margin: 25 }}
            onPress={() => {
              onPress({ amount, description });
              onRequestClose();
            }}
          />
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
