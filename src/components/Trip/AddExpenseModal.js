import {Platform, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import EntIcon from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import TitleModal from '../TitleModal';
import KeyboardView from '../KeyboardView';
import i18n from '../../utils/i18n';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Subtitle from '../typography/Subtitle';
import toastConfig from '../../constants/ToastConfig';
import AsyncStorageDAO from '../../utils/AsyncStorageDAO';
import PremiumController from '../../PremiumController';
import Body from '../typography/Body';
import AvatarChip from '../AvatarChip';
import MembersModal from '../MembersModal';
import CategoryChip from '../CategoryChip';
import EXPENSES_CATEGORY from '../../constants/ExpensesCategories';
import SelectionModal from '../SelectionModal';
import Utils from '../../utils';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useMutation} from '@apollo/client';
import UPDATE_EXPENSE from '../../mutations/updateExpense';
import activeTripStore from '../../stores/ActiveTripStore';

const asyncStorageDAO = new AsyncStorageDAO();

export default function AddExpenseModal({
  isVisible,
  onRequestClose,
  onPress,
  isLoading,
  expenses,
  userId,
  activeMembers,
  isProMember,
  currency,
  updateExpense,
}) {
  // MUTATIONS
  const [updateExisitingExpense, {loading}] = useMutation(UPDATE_EXPENSE);

  // STORES
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);

  // STATE & MISC
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [paidBy, setPaidBy] = useState(
    activeMembers.find(member => member.id === userId),
  );
  const [splitBy, setSplitBy] = useState([]);
  const [membersVisible, setMembersVisible] = useState(false);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState(
    EXPENSES_CATEGORY.length - 1,
  );

  const allSpliteesSelected = splitBy?.length === activeMembers?.length;
  const splitPercentage = !splitBy?.length
    ? 0
    : (100 / splitBy?.length).toFixed(2);

  const splitAmount =
    !splitBy?.length || !amount
      ? 0
      : (parseFloat(amount) / splitBy?.length).toFixed(2);

  const isUpdate = updateExpense;

  useEffect(() => {
    if (isVisible && updateExpense) {
      const {
        amount: _amount,
        category: _category,
        paidBy: _paidBy,
        splitBy: _splitBy,
        title: _title,
      } = updateExpense;
      setAmount(`${_amount}`);
      setTitle(_title);
      setPaidBy(activeMembers.find(member => member.id === _paidBy));
      setSplitBy(_splitBy);
      setCategoryIndex(
        EXPENSES_CATEGORY.findIndex(cat => cat.id === _category),
      );
    }
  }, [isVisible]);

  useEffect(() => {
    if (!updateExpense) {
      setPaidBy(activeMembers.find(member => member.id === userId));
    }

    if (!isVisible) {
      cleanData();
    }
  }, [isVisible]);

  const cleanData = () => {
    setAmount('');
    setTitle('');
    setCategoriesVisible(false);
    setCategoryIndex(EXPENSES_CATEGORY.length - 1);
    setPaidBy(activeMembers.find(member => member.id === userId));
    setSplitBy([]);
  };

  const showWarning = message => {
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

    if (isUpdate) {
      let _amount;
      _amount = amount.replaceAll(',', '.');
      _amount = parseFloat(amount);

      const updatedExpense = {
        title,
        amount: _amount,
        paidBy: paidBy.id,
        splitBy,
        currency: currency.symbol,
        category: EXPENSES_CATEGORY[categoryIndex].id,
        id: updateExpense._id,
      };

      await updateExisitingExpense({
        variables: {
          expense: updatedExpense,
        },
      })
        .then(res => {
          updateActiveTrip({
            expenses: expenses.map(expense => {
              if (expense._id === updateExpense._id) {
                return {
                  ...updatedExpense,
                  createdAt: Date.now(),
                };
              }

              return expense;
            }),
          });
          onRequestClose();
        })
        .catch(e => {
          Toast.show({
            type: 'error',
            text1: i18n.t('Whoops!'),
            text2: e.message,
          });
          console.log(`ERROR: ${e.message}`);
        });
      return;
    }

    const usageLimit = JSON.parse(
      isProMember
        ? await asyncStorageDAO.getPremiumTierLimits()
        : await asyncStorageDAO.getFreeTierLimits(),
    ).expenses;

    if (expenses?.length >= usageLimit) {
      onRequestClose();
      setTimeout(() => PremiumController.showModal(), 500);
      return;
    }

    onPress({
      amount,
      title,
      paidBy,
      category: EXPENSES_CATEGORY[categoryIndex],
      splitBy,
    });
  };

  const getAmountContainer = useCallback(
    () => (
      <View style={styles.amountContainer}>
        <Body type={1} text={i18n.t('Amount')} color={COLORS.neutral[300]} />
        <View
          style={{
            alignItems: 'flex-end',
            marginTop: 6,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '87%',
          }}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <TextInput
              onChangeText={val => setAmount(val.replace(',', '.'))}
              keyboardType="numeric"
              maxLength={10}
              value={amount}
              style={styles.amountInput}
              placeholderTextColor={COLORS.neutral[100]}
              placeholder={i18n.t('150')}
            />
          </View>
        </View>
      </View>
    ),
    [amount],
  );

  const getDescriptionContainer = useCallback(
    () => (
      <View style={styles.descriptionContainer}>
        <Subtitle
          type={1}
          style={{marginLeft: PADDING.xl}}
          color={COLORS.neutral[300]}
          text={i18n.t('Expense description')}
        />
        <TextInput
          maxLength={20}
          onChangeText={val => setTitle(val)}
          style={styles.descriptionInput}
          value={title}
          placeholderTextColor={COLORS.neutral[100]}
          placeholder={i18n.t('Birthday Cake 🎂')}
        />
      </View>
    ),
    [title],
  );

  const getInfoContainer = useCallback(
    () => (
      <View style={styles.infoContainer}>
        <View style={{flex: 1}}>
          <Subtitle
            type={1}
            style={{marginLeft: PADDING.xl}}
            color={COLORS.neutral[300]}
            text={i18n.t('Paid by')}
          />
          <AvatarChip
            onPress={() => setMembersVisible(true)}
            style={{marginLeft: PADDING.xl, marginRight: 'auto', marginTop: 8}}
            name={paidBy?.firstName}
            uri={paidBy?.avatarUri}
          />
        </View>
        <View style={{flex: 1}}>
          <Subtitle
            type={1}
            color={COLORS.neutral[300]}
            text={i18n.t('Category')}
          />
          <CategoryChip
            onPress={() => setCategoriesVisible(true)}
            style={{marginRight: 'auto', marginTop: 8}}
            color={EXPENSES_CATEGORY[categoryIndex].color}
            string={EXPENSES_CATEGORY[categoryIndex].title}
          />
        </View>
      </View>
    ),
    [categoryIndex, paidBy, activeMembers],
  );

  const getSplitByContainer = useCallback(
    () => (
      <View
        style={[
          styles.infoContainer,
          {
            flexDirection: 'column',
            marginRight: PADDING.l,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Subtitle
            type={1}
            style={{marginLeft: PADDING.xl}}
            color={COLORS.neutral[300]}
            text={i18n.t('Split between')}
          />
          <Pressable
            onPress={() =>
              allSpliteesSelected
                ? setSplitBy([])
                : setSplitBy(activeMembers.map(member => member.id))
            }
            style={{flexDirection: 'row'}}>
            <Subtitle
              type={1}
              color={
                allSpliteesSelected ? COLORS.neutral[300] : COLORS.primary[700]
              }
              text={
                allSpliteesSelected
                  ? i18n.t('deselected all')
                  : i18n.t('selected all')
              }
            />
            {!allSpliteesSelected && (
              <EntIcon
                name="check"
                color={
                  allSpliteesSelected
                    ? COLORS.neutral[300]
                    : COLORS.primary[700]
                }
                style={{marginRight: 2}}
                size={16}
              />
            )}
          </Pressable>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingLeft: PADDING.l}}
          style={{marginRight: -PADDING.l, marginTop: 15}}
          horizontal>
          {activeMembers.map(member => {
            const isSelected = splitBy.includes(member.id);
            const backgroundColor = isSelected
              ? COLORS.primary[500]
              : 'transparent';
            const borderWidth = isSelected ? 0 : 1;

            return (
              <Pressable
                onPress={() => {
                  RNReactNativeHapticFeedback.trigger('impactLight');
                  if (isSelected) {
                    return setSplitBy(prev =>
                      prev.filter(splitee => splitee !== member.id),
                    );
                  }
                  setSplitBy(prev => [...prev, member.id]);
                }}
                style={{alignItems: 'center', marginRight: 10}}>
                <Body
                  type={2}
                  color={isSelected ? COLORS.primary[700] : COLORS.neutral[300]}
                  style={{
                    fontWeight: '500',
                    marginBottom: 6,
                    textDecorationLine: !isSelected ? 'line-through' : 'none',
                  }}
                  text={member.firstName}
                />
                <View
                  style={[styles.splitBubble, {backgroundColor, borderWidth}]}>
                  <Body
                    type={2}
                    color={isSelected ? COLORS.shades[0] : COLORS.shades[100]}
                    text={`${currency.symbol}${isSelected ? splitAmount : 0}`}
                  />
                  <Body
                    type={2}
                    color={
                      isSelected
                        ? Utils.addAlpha(COLORS.neutral[50], 0.8)
                        : COLORS.neutral[300]
                    }
                    style={{fontSize: 12, fontWeight: '500'}}
                    text={`${isSelected ? splitPercentage : 0}%`}
                  />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    ),
    [splitBy],
  );

  const getSummaryContainer = useCallback(
    () => (
      <View style={styles.summaryContainer}>
        <Body
          type={1}
          style={{fontWeight: '500'}}
          color={COLORS.neutral[900]}
          text={paidBy?.firstName}
        />
        <Body
          type={1}
          color={COLORS.neutral[300]}
          style={{marginHorizontal: 2}}
          text={i18n.t('paid')}
        />
        <Body
          type={1}
          style={{fontWeight: '500'}}
          color={COLORS.neutral[900]}
          text={`${currency?.symbol}${amount || '0'}`}
        />
        {title.length > 0 && (
          <>
            <Body
              type={1}
              color={COLORS.neutral[300]}
              style={{marginHorizontal: 2}}
              text={i18n.t('for')}
            />
            <Body
              type={1}
              style={{fontWeight: '500'}}
              color={COLORS.neutral[900]}
              text={title || ''}
            />
          </>
        )}
        {splitBy.length > 0 && (
          <>
            <Body
              type={1}
              color={COLORS.neutral[300]}
              style={{marginHorizontal: 2}}
              text={i18n.t('split between')}
            />
            <Body
              type={1}
              color={COLORS.shades[100]}
              style={{
                marginHorizontal: 2,
                fontWeight: '500',
                textAlign: 'center',
              }}
              text={`${activeMembers
                .filter(m => splitBy.includes(m.id))
                .map(m => ` ${m.firstName}`)}`}
            />
          </>
        )}
      </View>
    ),
    [isVisible, title, paidBy, currency, amount, splitBy],
  );

  return (
    <TitleModal
      isVisible={isVisible}
      onRequestClose={() => {
        setAmount('');
        setTitle('');
        setPaidBy(activeMembers.find(member => member.id === userId));
        onRequestClose();
      }}
      title={i18n.t('Expense')}
      actionLabel={isUpdate ? i18n.t('Update') : i18n.t('Create')}
      onPress={handlePress}
      isLoading={isLoading || loading}
      isDisabled={amount.length <= 0 || title.length <= 0}>
      <KeyboardView paddingBottom={50}>
        <View style={styles.container}>
          <View>
            {getAmountContainer()}
            {getDescriptionContainer()}
            {getInfoContainer()}
            {getSplitByContainer()}
            {getSummaryContainer()}
          </View>
        </View>
      </KeyboardView>
      <Toast config={toastConfig} />
      <MembersModal
        isVisible={membersVisible}
        onRequestClose={() => setMembersVisible(false)}
        members={activeMembers}
        initalMemberId={paidBy?.id}
        onPress={user => setPaidBy(user)}
      />
      <SelectionModal
        isVisible={categoriesVisible}
        data={EXPENSES_CATEGORY}
        isCategories
        initIndex={categoryIndex}
        onPress={i => setCategoryIndex(i)}
        onRequestClose={() => setCategoriesVisible(false)}
        title={i18n.t('Select category')}
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
    color: COLORS.shades[100],
    fontSize: 46,
    textAlign: 'center',
    fontFamily: 'WorkSans-Regular',
    height: Platform.OS !== 'android' ? 40 : null,
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
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
  },
  descriptionInput: {
    color: COLORS.shades[100],
    paddingLeft: PADDING.xl,
    marginTop: 10,
    fontSize: 18,
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
    maxWidth: '60%',
    borderRadius: RADIUS.s,
    backgroundColor: COLORS.neutral[50],
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  splitBubble: {
    borderColor: COLORS.neutral[100],
    height: 65,
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
  },
});
