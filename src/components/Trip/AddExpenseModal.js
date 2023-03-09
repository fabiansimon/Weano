import {
  StyleSheet, View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Entypo';
import { MenuView } from '@react-native-menu/menu';
import TitleModal from '../TitleModal';
import KeyboardView from '../KeyboardView';
import i18n from '../../utils/i18n';
import Headline from '../typography/Headline';
import COLORS, { PADDING } from '../../constants/Theme';
import Subtitle from '../typography/Subtitle';
import toastConfig from '../../constants/ToastConfig';
import AsyncStorageDAO from '../../utils/AsyncStorageDAO';
import PremiumController from '../../PremiumController';
import Body from '../typography/Body';
import AvatarChip from '../AvatarChip';
import MembersModal from '../MembersModal';

const asyncStorageDAO = new AsyncStorageDAO();

export default function AddExpenseModal({
  isVisible, onRequestClose, onPress, isLoading, expenses, userId, activeMembers, isProMember,
}) {
  // STATE & MISC
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [paidBy, setPaidBy] = useState(activeMembers.find((member) => member.id === userId));
  const [membersVisible, setMembersVisible] = useState(false);
  const [currency, setCurrency] = useState({
    symbol: '$',
    string: 'USD',
  });

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
      amount, title, currency, paidBy,
    });
  };

  const changeCurrency = ({ event }) => {
    if (!event) {
      return;
    }
    setCurrency({
      symbol: event.split(' ')[0].trim(),
      string: event.split(' ')[1].trim(),
    });
  };

  const getAmountContainer = () => (
    <View style={styles.amountContainer}>
      <Body
        type={1}
        text={i18n.t('Amount')}
        color={COLORS.neutral[300]}
      />
      <View style={{
        alignItems: 'flex-end', marginTop: 0, flexDirection: 'row', justifyContent: 'space-between', width: '87%',
      }}
      >
        <View style={{
          width: '100%', position: 'absolute', alignItems: 'center',
        }}
        >
          <TextInput
            onChangeText={(val) => setAmount(val)}
            keyboardType="numeric"
            maxLength={6}
            style={styles.amountInput}
            placeholderTextColor={COLORS.neutral[100]}
            placeholder={i18n.t('150')}
          />
        </View>
        <MenuView
          style={styles.addIcon}
          onPressAction={({ nativeEvent }) => changeCurrency(nativeEvent)}
          actions={[
            {
              id: '€ EUR',
              title: i18n.t('€ EUR'),
            },
            {
              id: '£ GBP',
              title: i18n.t('£ GBP'),
            },
            {
              id: '₣ CHF',
              title: i18n.t('₣ CHF'),
            },
            {
              id: '¥ JPY',
              title: i18n.t('¥ JPY'),
            },
            {
              id: '¥ CNY',
              title: i18n.t('¥ CNY'),
            },
            {
              id: '$ USD',
              title: i18n.t('$ USD'),
            },
            {
              id: '$ CAD',
              title: i18n.t('$ CAD'),
            },
            {
              id: '$ AUD',
              title: i18n.t('$ AUD'),
            },
            {
              id: '$ NZD',
              title: i18n.t('$ NZD'),
            },
            {
              id: '$ HKD',
              title: i18n.t('$ HKD'),
            },

          ]}
        >
          <View
            style={styles.currencyContainer}
          >
            <>
              <Headline
                type={3}
                style={{
                  marginBottom: 6, marginRight: 6, fontWeight: '400', fontSize: 24,
                }}
                text={currency?.symbol}
                color={COLORS.shades[100]}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Subtitle
                  type={1}
                  text={currency?.string}
                  color={COLORS.shades[100]}
                />
                <Icon
                  name="chevron-down"
                  color={COLORS.shades[100]}
                  size={18}
                />
              </View>
            </>
          </View>
        </MenuView>
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
            {getAmountContainer()}
            {getDescriptionContainer()}
            {getInfoContainer()}
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
    marginTop: 30,
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
  currencyContainer: {
    alignItems: 'center',
  },
});
