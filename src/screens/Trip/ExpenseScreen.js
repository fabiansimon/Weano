import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import RNReactNativeHapticFeedback from 'react-native-haptic-feedback';
import React, {useRef, useState, useEffect, useMemo, useCallback} from 'react';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Entypo';
import {useMutation} from '@apollo/client';
import Toast from 'react-native-toast-message';
import {MenuView} from '@react-native-menu/menu';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Headline from '../../components/typography/Headline';
import ExpenseTile from '../../components/Trip/ExpenseTile';
import Divider from '../../components/Divider';
import ExpensesContainer from '../../components/Trip/ExpenseContainer';
import FAButton from '../../components/FAButton';
import AddExpenseModal from '../../components/Trip/AddExpenseModal';
import ADD_EXPENSE from '../../mutations/addExpense';
import Body from '../../components/typography/Body';
import userStore from '../../stores/UserStore';
import activeTripStore from '../../stores/ActiveTripStore';
import ExpenseDetailModal from '../../components/Trip/ExpenseDetailModal';
import DELETE_EXPENSE from '../../mutations/deleteExpense';
import UPDATE_TRIP from '../../mutations/updateTrip';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../../constants/Routes';
import Utils from '../../utils';
import userManagement from '../../utils/userManagement';
import InfoController from '../../controllers/InfoController';
import UPDATE_EXPENSE from '../../mutations/updateExpense';
import Subtitle from '../../components/typography/Subtitle';

const DEFAULT_ITEMS_AMOUNT = 10;

export default function ExpenseScreen() {
  // MUTATIONS
  const [updateExisitingExpense] = useMutation(UPDATE_EXPENSE);
  const [addExpense, {loading, error}] = useMutation(ADD_EXPENSE);
  const [deleteExpense] = useMutation(DELETE_EXPENSE);
  const [updateTrip] = useMutation(UPDATE_TRIP);

  // STORES
  const {
    expenses,
    activeMembers: users,
    id: tripId,
    currency,
    dateRange,
    budget,
  } = activeTripStore(state => state.activeTrip);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);
  const {id, isProMember} = userStore(state => state.user);

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const [itemsAmount, setItemsAmount] = useState(DEFAULT_ITEMS_AMOUNT);
  const [showTotal, setShowTotal] = useState(true);
  const [updateExpense, setUpdateExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState({
    isVisible: false,
    data: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amountLoading, setAmountLoading] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [squashExpense, setSquashExpense] = useState(null);

  const isHost = userManagement.isHost();
  const isSolo = users.length === 1;

  const data = useMemo(() => {
    if (showTotal) {
      return expenses;
    }

    return expenses.filter(expense => expense.paidBy === id);
  }, [showTotal, expenses]);

  const renderData = useMemo(() => {
    if (data.length <= itemsAmount) {
      return data;
    }
    return data.slice(data.length - itemsAmount, data.length);
  }, [data, itemsAmount]);

  const restDays = useMemo(() => {
    const {endDate} = dateRange;
    return Utils.getDaysDifference(Date.now() / 1000, endDate, true);
  }, [dateRange]);

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const dailyBudget = useMemo(() => {
    return (budget - totalAmount) / restDays;
  }, [budget, totalAmount, restDays]);

  const spentToday = useMemo(() => {
    return expenses.reduce((accumulator, expense) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expenseDate = new Date(expense.createdAt * 1);

      expenseDate.setHours(0, 0, 0, 0);

      if (expenseDate.getTime() === today.getTime()) {
        return accumulator + expense.amount;
      }
      return accumulator;
    }, 0);
  }, [expenses]);

  const navigation = useNavigation();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error.message,
        });
      }, 500);
    }
  }, [error]);

  const handleEditExpense = data => {
    setUpdateExpense(data);
    setSelectedExpense(prev => {
      return {
        ...prev,
        isVisible: false,
      };
    });
    setTimeout(() => {
      setShowModal(true);
    }, 500);
  };

  const updateAmount = async (expense, amount) => {
    amount = amount.replaceAll(',', '.');
    amount = parseFloat(amount);

    if (amount <= 0 || isNaN(amount)) {
      Toast.show({
        type: 'warning',
        text1: i18n.t('Whoops'),
        text2: i18n.t('This is not a valid amount'),
      });
      return;
    }

    const {amount: oldAmount, _id} = expense;

    amount = parseFloat(oldAmount) + amount;

    await updateExisitingExpense({
      variables: {
        expense: {
          amount,
          id: _id,
        },
      },
    })
      .then(() => {
        updateActiveTrip({
          expenses: expenses.map(expense => {
            if (expense._id === _id) {
              return {
                ...expense,
                amount: amount,
                updatedAt: Date.now(),
              };
            }

            return expense;
          }),
        });
      })
      .catch(e => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        console.log(`ERROR: ${e.message}`);
      });
  };

  const handleAddExpense = async data => {
    setIsLoading(true);

    const toRemove = data?.squashExpense?.selected;

    let {amount} = data;
    const {
      title,
      paidBy: {id: paidBy},
      category: {id: categoryId},
      splitBy,
    } = data;
    amount = amount.replaceAll(',', '.');
    amount = parseFloat(amount);

    await addExpense({
      variables: {
        expense: {
          amount,
          title,
          tripId,
          paidBy,
          currency: currency.symbol,
          category: categoryId,
          splitBy: isSolo ? [users[0].id] : splitBy,
          squashedExpenses: toRemove,
        },
      },
    })
      .then(res => {
        const expenseId = res.data.createExpense;
        const newExpense = {
          amount,
          updatedAt: Date.now(),
          createdAt: Date.now(),
          creatorId: id,
          currency: currency.symbol,
          paidBy,
          title,
          _id: expenseId,
          category: categoryId,
          splitBy: isSolo ? [users[0].id] : splitBy,
        };

        updateActiveTrip({
          expenses: [
            ...expenses.filter(e => !toRemove?.includes(e._id)),
            newExpense,
          ],
        });
      })
      .catch(e => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        console.log(`ERROR: ${e.message}`);
      });
    setIsLoading(false);
    setShowModal(false);
  };

  const confirmDeletion = async expense => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Expense'),
      i18n.t(
        `Are you sure you want to delete '${expense.title}' as an expense?`,
      ),
      i18n.t('Delete'),
      async () => {
        handleDeletion(expense);
      },
    );
  };

  const handleDeletion = async expense => {
    setSelectedExpense(prev => ({...prev, isVisible: false}));

    const {_id} = expense;

    const oldExpenses = expenses;

    updateActiveTrip({expenses: expenses.filter(p => p._id !== _id)});

    await deleteExpense({
      variables: {
        data: {
          id: _id,
          tripId,
        },
      },
    })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: i18n.t('Whooray!'),
          text2: i18n.t('Expense was succeessfully deleted!'),
        });
      })
      .catch(e => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: e.message,
        });
        updateActiveTrip({expense: oldExpenses});
        console.log(`ERROR: ${e.message}`);
      });
  };

  const getListHeader = useCallback(
    () => (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
        }}>
        <Pressable
          onPress={() => {
            setShowTotal(true);
            updateItemsAmount(DEFAULT_ITEMS_AMOUNT);
          }}
          activeOpacity={0.9}
          style={{flex: 1}}>
          <Body
            type={1}
            style={{alignSelf: 'center', fontWeight: '500'}}
            color={showTotal ? COLORS.primary[700] : COLORS.neutral[300]}
            text={i18n.t('Total')}
          />
          <View style={showTotal ? styles.activeTab : styles.inactiveTab} />
        </Pressable>
        <Pressable
          onPress={() => {
            setShowTotal(false);
            updateItemsAmount(DEFAULT_ITEMS_AMOUNT);
          }}
          activeOpacity={0.9}
          style={{flex: 1}}>
          <Body
            type={1}
            style={{alignSelf: 'center', fontWeight: '500'}}
            color={!showTotal ? COLORS.primary[700] : COLORS.neutral[300]}
            text={i18n.t('You')}
          />
          <View style={!showTotal ? styles.activeTab : styles.inactiveTab} />
        </Pressable>
      </View>
    ),
    [users, showTotal],
  );

  const changeCurrency = async ({event}) => {
    if (!event) {
      return;
    }

    const newCurrency = {
      symbol: event.split(' ')[0].trim(),
      string: event.split(' ')[1].trim(),
    };
    updateActiveTrip({
      currency: newCurrency,
    });

    await updateTrip({
      variables: {
        trip: {
          currency: newCurrency,
          tripId,
        },
      },
    });
  };

  const increaseAlert = item => {
    Alert.prompt(
      i18n.t('Increase Amount'),
      i18n.t('How much would you like to add to this Expense?'),
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: amount => updateAmount(item, amount),
        },
      ],
      'plain-text',
      '',
      'numeric',
    );
  };

  const handleExpenseSquash = () => {
    const _expenses = expenses.filter(e => selectedExpenses.includes(e._id));
    const _totalAmount = _expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    setSquashExpense({
      data: {
        amount: _totalAmount,
        title: _expenses[0].title,
        paidBy: _expenses[0]._id,
        splitBy: [],
        category: _expenses[0].category,
      },
      selected: selectedExpenses,
    });
    setShowModal(true);

    setSelectedExpenses([]);
  };

  const updateItemsAmount = count => {
    setAmountLoading(true);
    setTimeout(() => {
      try {
        RNReactNativeHapticFeedback.trigger('impactLight');
        if (itemsAmount >= expenses.length) {
          return setItemsAmount(DEFAULT_ITEMS_AMOUNT);
        }
        setItemsAmount(prev => count || (prev += 5));
      } finally {
        setAmountLoading(false);
      }
    }, 100);
  };

  const getBudgetContainer = useCallback(() => {
    const restBudget = (budget - totalAmount) / restDays;

    return (
      <View style={styles.budgetContainer}>
        {/* <View>
          <Subtitle color={COLORS.neutral[300]} text={'Spent'} />
          <Headline
            type={3}
            style={{fontSize: 16}}
            color={
              spentToday > restBudget ? COLORS.error[900] : COLORS.neutral[700]
            }
            text={`${currency.symbol}${spentToday.toFixed(2)}`}
          />
        </View>
        <View style={{marginHorizontal: 6}}>
          <Subtitle color={COLORS.neutral[300]} text={'|'} />
        </View> */}
        <View>
          <Subtitle color={COLORS.neutral[300]} text={'Daily Budget'} />
          <Headline
            style={{fontSize: 16}}
            type={3}
            color={COLORS.neutral[700]}
            text={`${currency.symbol}${restBudget}`}
          />
        </View>
      </View>
    );
  }, [budget, expenses]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HybridHeader
        title={i18n.t('Expenses')}
        subtitle={
          budget &&
          `${i18n.t('Daily Budget:')} ${currency?.symbol}${Utils.formatDigit(
            dailyBudget,
          )}`
        }
        scrollY={scrollY}
        ref={scrollRef}
        info={INFORMATION.expensesScreen}
        trailing={
          <CurrencyPicker
            currency={currency}
            onPressAction={e => changeCurrency(e)}
          />
        }>
        <View style={{marginHorizontal: PADDING.l}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 16,
              justifyContent: 'space-between',
            }}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <Headline
                  type={1}
                  text={`${currency.symbol}${Utils.formatDigit(totalAmount)}`}
                />
                {budget && (
                  <Subtitle
                    type={3}
                    color={COLORS.neutral[300]}
                    style={{marginBottom: 4, marginLeft: 2}}
                    text={`/${currency.symbol}${Utils.formatDigit(budget)}`}
                  />
                )}
              </View>
              <Body
                type={4}
                style={{marginTop: -2}}
                text={i18n.t('total expenses')}
                color={COLORS.neutral[300]}
              />
            </View>
            <Pressable
              onPress={() => {
                if (expenses.length <= 0) {
                  return InfoController.showModal(
                    i18n.t('Sorry'),
                    i18n.t('There are no expenses to settle at the moment.'),
                  );
                }

                if (!isHost) {
                  return InfoController.showModal(
                    i18n.t('Sorry'),
                    i18n.t('Only a host can settle the expenses of the trip.'),
                  );
                }

                return navigation.navigate(ROUTES.settleExpensesScreen, {
                  totalAmount,
                });
              }}
              style={[
                styles.settleButton,
                {
                  opacity:
                    isHost && users.length && expenses.length > 1 ? 1 : 0.5,
                },
              ]}>
              <Body
                type={2}
                color={COLORS.shades[0]}
                style={{fontWeight: '500'}}
                text={
                  isSolo
                    ? i18n.t('analyze expenses')
                    : i18n.t('settle expenses')
                }
              />
            </Pressable>
          </View>

          <ExpensesContainer
            showIndividual
            style={{marginTop: 30}}
            data={expenses}
          />
          <View style={styles.summaryContainer}>
            <FlatList
              ListFooterComponent={() => !isSolo && getListHeader()}
              style={{borderRadius: RADIUS.m, overflow: 'hidden'}}
              ListHeaderComponent={
                data.length > DEFAULT_ITEMS_AMOUNT && (
                  <Pressable
                    onLongPress={() => updateItemsAmount(expenses.length)}
                    onPress={() => updateItemsAmount()}
                    style={styles.loadMoreButton}>
                    {amountLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <>
                        <Subtitle
                          style={{fontWeight: '500', fontSize: 15}}
                          color={COLORS.neutral[700]}
                          text={
                            itemsAmount < expenses.length
                              ? i18n.t('Show more')
                              : i18n.t('Minimize')
                          }
                        />
                        <Subtitle
                          color={COLORS.neutral[300]}
                          text={`${Math.min(itemsAmount, data.length)} / ${
                            data.length
                          } ${i18n.t('expenses')}`}
                        />
                      </>
                    )}
                  </Pressable>
                )
              }
              ListEmptyComponent={
                <Body
                  type={2}
                  style={{
                    textAlign: 'center',
                    paddingHorizontal: 6,
                  }}
                  text={
                    showTotal
                      ? i18n.t('No expenses added yet 😕')
                      : i18n.t("You didn't add any expenses yet 😕")
                  }
                  color={COLORS.neutral[300]}
                />
              }
              inverted
              keyExtractor={item => item._id}
              data={renderData}
              renderItem={({item}) => {
                const userData = users.find(u => u.id === item.paidBy);
                const isSelf = id === item.paidBy;

                return (
                  <ExpenseTile
                    isSolo={isSolo}
                    onLongPress={() => {
                      setSelectedExpenses(() => [item._id]);
                    }}
                    isSelected={
                      selectedExpenses?.length === 0
                        ? -1
                        : selectedExpenses.includes(item._id)
                        ? 1
                        : 0
                    }
                    isSelf={isSelf}
                    currency={currency}
                    onPress={() => {
                      if (selectedExpenses?.length > 0) {
                        setSelectedExpenses(prev => {
                          if (selectedExpenses.includes(item._id)) {
                            return prev.filter(e => e !== item._id);
                          }

                          return [...prev, item._id];
                        });
                        return;
                      }

                      setSelectedExpense({
                        isVisible: true,
                        data: item,
                      });
                    }}
                    onIncreaseAmount={
                      isSelf || !userData ? () => increaseAlert(item) : null
                    }
                    onDelete={
                      isSelf || !userData ? () => confirmDeletion(item) : null
                    }
                    style={{paddingHorizontal: 15, paddingVertical: 14}}
                    data={item}
                    user={userData}
                  />
                );
              }}
              ItemSeparatorComponent={
                <Divider
                  style={{marginLeft: 70}}
                  omitPadding
                  color={COLORS.neutral[50]}
                />
              }
            />
          </View>
        </View>
      </HybridHeader>
      {/* {budget && selectedExpenses.length === 0 && getBudgetContainer()} */}
      <FAButton
        icon={selectedExpenses.length > 0 ? 'copy-outline' : 'add'}
        color={
          selectedExpenses.length > 0
            ? COLORS.success[700]
            : COLORS.primary[700]
        }
        iconSize={selectedExpenses.length > 0 ? 24 : 28}
        onPress={() =>
          selectedExpenses.length > 0
            ? handleExpenseSquash()
            : setShowModal(true)
        }
      />
      <AddExpenseModal
        tripId={tripId}
        currency={currency}
        isVisible={showModal}
        updateExpense={updateExpense}
        squashExpense={squashExpense}
        isProMember={isProMember}
        onRequestClose={() => {
          setShowModal(false);
          setSquashExpense(null);
          setUpdateExpense(null);
        }}
        onPress={data => handleAddExpense(data)}
        isLoading={isLoading || loading}
        expenses={expenses}
        userId={id}
        activeMembers={users}
      />
      <ExpenseDetailModal
        currency={currency}
        onEdit={data => handleEditExpense(data)}
        isVisible={selectedExpense.isVisible}
        onRequestClose={() =>
          setSelectedExpense(prev => ({
            ...prev,
            isVisible: false,
          }))
        }
        users={users}
        data={selectedExpense.data}
        onDelete={expense => handleDeletion(expense)}
      />
    </View>
  );
}

function CurrencyPicker({currency, onPressAction}) {
  return (
    <MenuView
      style={{marginLeft: PADDING.l, marginTop: 6}}
      onPressAction={({nativeEvent}) => onPressAction(nativeEvent)}
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
      ]}>
      <View style={styles.currencyContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Body
            type={1}
            style={{fontWeight: '500'}}
            text={`${currency?.symbol} ${currency?.string}`}
            color={COLORS.primary[700]}
          />
          <Icon name="chevron-down" color={COLORS.primary[700]} size={18} />
        </View>
      </View>
    </MenuView>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    marginTop: 12,
    height: 4,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[500],
    zIndex: 2,
  },
  inactiveTab: {
    marginTop: 13,
    height: 1,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[100],
    zIndex: 2,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  summaryContainer: {
    marginTop: 25,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: COLORS.neutral[100],
    marginBottom: 120,
  },
  settleButton: {
    marginTop: 4,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 35,
  },
  budgetContainer: {
    position: 'absolute',
    left: PADDING.l,
    flexDirection: 'row',
    bottom: Platform.OS === 'android' ? 30 : 40,
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: COLORS.neutral[900],
    shadowRadius: 20,
    shadowOffset: {
      x: 0,
      y: 20,
    },
    shadowOpacity: 0.05,
  },
  loadMoreButton: {
    borderTopColor: COLORS.neutral[50],
    borderTopWidth: 1,
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
