import React, {useRef, useState, useCallback, useMemo} from 'react';
import Animated from 'react-native-reanimated';
import HybridHeader from '../components/HybridHeader';
import {
  Alert,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import i18n from '../utils/i18n';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Body from '../components/typography/Body';
import Headline from '../components/typography/Headline';
import EXPENSES_CATEGORY from '../constants/ExpensesCategories';
import userManagement from '../utils/userManagement';
import Utils from '../utils';
import SplitExpenseContainer from '../components/Trip/SplitExpenseContainer';
import activeTripStore from '../stores/ActiveTripStore';
import AddExpenseModal from '../components/Trip/AddExpenseModal';
import FAButton from '../components/FAButton';
import SettleModal from '../components/Trip/SettleModal';

const {width} = Dimensions.get('window');

export default function SettleExpensesScreen() {
  // STORES
  const {
    expenses,
    activeMembers,
    currency,
    title,
    id: tripId,
  } = activeTripStore(state => state.activeTrip);

  // STATE & MISC
  const [editExpense, setEditExpense] = useState(null);
  const [settleVisible, setSettleVisible] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const totalAmount = useMemo(() => {
    let amount = 0;
    expenses.forEach(expense => {
      amount += expense.amount;
    });
    return amount.toFixed(2);
  }, [expenses]);

  const handleSettle = () => {
    if (expenses.find(exp => exp.splitBy.length <= 0)) {
      return Alert.alert(
        i18n.t('Whoops'),
        i18n.t(
          'There are expenses without any splitees. Before settling please make sure to add them.',
        ),
      );
    }

    setSettleVisible(true);
  };

  const getLinearBar = useCallback(() => {
    return (
      <View style={styles.bottomBar}>
        <View style={{flexDirection: 'row', position: 'absolute'}}>
          {EXPENSES_CATEGORY.map(e => {
            const {color} = e;
            const width = getLineWidth(e.id);
            return (
              <View style={[styles.bar, {width, backgroundColor: color}]} />
            );
          })}
        </View>
      </View>
    );
  }, [expenses]);

  const getLineWidth = catId => {
    const totalCatAmount = expenses
      .filter(exp => exp.category === catId)
      .reduce((acc, obj) => acc + obj.amount, 0);

    return `${(totalCatAmount / totalAmount) * 100}%`;
  };

  const getDetailContainer = exp => {
    const {amount, category, createdAt, paidBy, title} = exp;
    const {color} = EXPENSES_CATEGORY.find(cat => cat.id === category);
    const paidByUser = activeMembers.find(m => m.id === exp.paidBy);

    return (
      <View style={styles.expenseSummary}>
        <View style={[styles.infoContainer, {backgroundColor: color}]} />
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <Headline type={4} text={title} />
            </View>
            <Headline type={4} text={`${currency.symbol}${amount}`} />
          </View>
          <Body
            type={2}
            text={`${paidByUser?.firstName}, ${Utils.getDateFromTimestamp(
              createdAt / 1000,
              'DD/MM/YY',
            )}`}
            color={COLORS.neutral[300]}
            style={{marginTop: 2}}
          />
          <SplitExpenseContainer
            onPress={() => {
              setEditExpense({
                ...exp,
                paidBy,
              });
            }}
            expense={exp}
            activeMembers={activeMembers}
            currency={currency}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HybridHeader title={i18n.t('Settle Expenses')} scrollY={scrollY}>
        <View style={styles.innerContainer}>
          <Headline type={1} text={`${currency.symbol}${totalAmount}`} />
          <Body
            type={4}
            style={{marginTop: -2}}
            text={i18n.t('total expenses')}
            color={COLORS.neutral[300]}
          />
          {getLinearBar()}
          <View style={styles.summaryContainer}>
            {expenses?.map(exp => {
              return getDetailContainer(exp);
            })}
          </View>
        </View>
      </HybridHeader>
      <FAButton
        icon={'arrow-forward'}
        iconStyle={{marginLeft: -2}}
        iconSize={24}
        onPress={handleSettle}
      />

      <AddExpenseModal
        currency={currency}
        isVisible={editExpense !== null}
        updateExpense={editExpense}
        onRequestClose={() => setEditExpense(null)}
        expenses={expenses || []}
        activeMembers={activeMembers}
        tripId={tripId}
      />

      <SettleModal
        isVisible={settleVisible}
        onRequestClose={() => setSettleVisible(false)}
        activeMembers={activeMembers}
        data={expenses}
        currency={currency.symbol}
        tripTitle={title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  bottomBar: {
    overflow: 'hidden',
    marginTop: 10,
    width: '100%',
    height: 8,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[100],
  },
  bar: {
    height: 8,
  },
  summaryContainer: {
    marginTop: 20,
    borderWidth: 1,
    marginBottom: 40,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.s,
    flex: 1,
    paddingBottom: 20,
  },
  infoContainer: {
    marginLeft: 8,
    top: 6,
    borderRadius: RADIUS.xl,
    height: 10,
    width: 10,
    marginRight: 8,
  },
  expenseSummary: {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 10,
    marginLeft: 4,
    marginBottom: 14,
  },
  innerContainer: {
    width,
    marginTop: 10,
    paddingHorizontal: PADDING.l,
    marginBottom: 50,
  },
});
