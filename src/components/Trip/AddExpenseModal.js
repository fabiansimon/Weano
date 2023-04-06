import {
  StyleSheet, View,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import TitleModal from '../TitleModal';
import KeyboardView from '../KeyboardView';
import i18n from '../../utils/i18n';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Subtitle from '../typography/Subtitle';
import toastConfig from '../../constants/ToastConfig';
import AsyncStorageDAO from '../../utils/AsyncStorageDAO';
import PremiumController from '../../PremiumController';
import Body from '../typography/Body';
import AvatarChip from '../AvatarChip';
import MembersModal from '../MembersModal';

const asyncStorageDAO = new AsyncStorageDAO();

export default function AddExpenseModal({
  isVisible, onRequestClose, onPress, isLoading, expenses, userId, activeMembers, isProMember, currency,
}) {
  // STATE & MISC
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [paidBy, setPaidBy] = useState(activeMembers.find((member) => member.id === userId));
  const [membersVisible, setMembersVisible] = useState(false);

  useEffect(() => {
    setPaidBy(activeMembers.find((member) => member.id === userId));
  }, [isVisible]);

  const showWarning = (message) => {
    Toast.show({
      type: 'warning',
      text1: i18n.t('Whoops!'),
      text2: message,
    });
  };

  const handlePress = async () => {
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
    const usageLimit = JSON.parse(isProMember ? await asyncStorageDAO.getPremiumTierLimits() : await asyncStorageDAO.getFreeTierLimits()).expenses;
    if (expenses?.length >= usageLimit) {
      onRequestClose();
      setTimeout(() => PremiumController.showModal(), 500);
      return;
    }

    onPress({
      amount, title, paidBy,
    });
    setAmount('');
    setTitle('');
    setPaidBy(activeMembers.find((member) => member.id === userId));
  };

  const getAmountContainer = () => (
    <View style={styles.amountContainer}>
      <Body
        type={1}
        text={i18n.t('Amount')}
        color={COLORS.neutral[300]}
      />
      <View style={{
        alignItems: 'flex-end', marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', width: '87%',
      }}
      >
        <View style={{
          width: '100%', alignItems: 'center',
        }}
        >
          <TextInput
            onChangeText={(val) => setAmount(val)}
            keyboardType="numeric"
            maxLength={10}
            style={styles.amountInput}
            placeholderTextColor={COLORS.neutral[100]}
            placeholder={i18n.t('150')}
          />
        </View>
      </View>
    </View>
  );

  const getDescriptionContainer = () => (
    <View style={styles.descriptionContainer}>
      <Subtitle
        type={1}
        style={{ marginLeft: PADDING.xl }}
        color={COLORS.neutral[300]}
        text={i18n.t('Expense description')}
      />
      <TextInput
        maxLength={20}
        onChangeText={(val) => setTitle(val)}
        style={styles.descriptionInput}
        placeholderTextColor={COLORS.neutral[100]}
        placeholder={i18n.t('Birthday Cake 🎂')}
      />
    </View>
  );

  const getInfoContainer = () => (
    <View style={styles.infoContainer}>
      <Subtitle
        type={1}
        style={{ marginLeft: PADDING.xl }}
        color={COLORS.neutral[300]}
        text={i18n.t('Paid by')}
      />
      <AvatarChip
        onPress={() => setMembersVisible(true)}
        style={{ marginLeft: PADDING.xl, marginRight: 'auto', marginTop: 8 }}
        name={paidBy?.firstName}
        uri={paidBy?.avatarUri}
      />
    </View>
  );

  const getSummaryContainer = useCallback(() => (
    <View style={styles.summaryContainer}>
      <Body
        type={1}
        style={{ fontWeight: '500' }}
        color={COLORS.neutral[900]}
        text={paidBy?.firstName}
      />
      <Body
        type={1}
        color={COLORS.neutral[300]}
        style={{ marginHorizontal: 2 }}
        text={i18n.t('paid')}
      />
      <Body
        type={1}
        style={{ fontWeight: '500' }}
        color={COLORS.neutral[900]}
        text={`${currency?.symbol}${amount || '0'}`}
      />
      {title.length > 0
      && (
      <>
        <Body
          type={1}
          color={COLORS.neutral[300]}
          style={{ marginHorizontal: 2 }}
          text={i18n.t('for')}
        />
        <Body
          type={1}
          style={{ fontWeight: '500' }}
          color={COLORS.neutral[900]}
          text={title || ''}
        />
      </>
      )}
    </View>
  ), [isVisible, title, paidBy, currency, amount]);

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={() => {
        setAmount('');
        setTitle('');
        setPaidBy(activeMembers.find((member) => member.id === userId));
        onRequestClose();
      }}
      title={i18n.t('Expense')}
      actionLabel={i18n.t('Create')}
      onPress={handlePress}
      isLoading={isLoading}
      isDisabled={amount.length <= 0 || title.length <= 0}
    >
      <KeyboardView paddingBottom={50}>
        <View style={styles.container}>
          <View>
            {getAmountContainer()}
            {getDescriptionContainer()}
            {getInfoContainer()}
            {getSummaryContainer()}
          </View>
        </View>
      </KeyboardView>
      <Toast config={toastConfig} />
      <MembersModal
        isVisible={membersVisible}
        onRequestClose={() => setMembersVisible(false)}
        members={activeMembers}
        initalMemberId={paidBy.id}
        onPress={(user) => setPaidBy(user)}
      />
    </TitleModal>
  );
}

const styles = StyleSheet.create({
  amountContainer: {
    alignItems: 'center',
    marginTop: 20,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  amountInput: {
    fontSize: 46,
    textAlign: 'center',
    fontFamily: 'WorkSans-Regular',
    height: 40,
    letterSpacing: -1,
    borderBottomColor: COLORS.neutral[100],
  },
  descriptionContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
  },
  infoContainer: {
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
  summaryContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.neutral[50],
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});
