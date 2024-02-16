import React, {useRef, useState, useCallback, useMemo} from 'react';
import Animated from 'react-native-reanimated';
import HybridHeader from '../components/HybridHeader';
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
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
import Subtitle from '../components/typography/Subtitle';

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
  const [filterCat, setFilterCat] = useState(null);

  const isSolo = activeMembers.length === 1;

  const scrollY = useRef(new Animated.Value(0)).current;

  const expensesData = useMemo(() => {
    if (filterCat) {
      return expenses.filter(e => e.category === filterCat);
    }
    return expenses;
  }, [expenses, filterCat]);

  const totalAmount = useMemo(() => {
    const amount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
    let _categoryData = [];
    for (const cat of EXPENSES_CATEGORY) {
      const {width, amount} = getCategoryData(cat.id);
      _categoryData.push({
        ...cat,
        width,
        amount,
      });
    }

    return (
      <View style={{marginTop: 8}}>
        <View style={styles.bottomBar}>
          <View style={{flexDirection: 'row', position: 'absolute'}}>
            {_categoryData.map(e => {
              const {color, width} = e;
              return (
                <View
                  style={[
                    styles.bar,
                    {width: `${width}%`, backgroundColor: color},
                  ]}
                />
              );
            })}
          </View>
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {_categoryData.map(({title, color, amount, id}) => {
            return (
              <Pressable
                onPress={() =>
                  setFilterCat(() => (filterCat === id ? null : id))
                }
                style={[
                  styles.catContainer,
                  {
                    flexDirection: 'row',
                    borderColor: color,
                    backgroundColor: Utils.addAlpha(
                      color,
                      !filterCat || filterCat === id ? 1 : 0.4,
                    ),
                  },
                ]}
                key={id}>
                <Subtitle type={1} color={COLORS.neutral[50]} text={title} />
                <Subtitle
                  type={1}
                  color={COLORS.neutral[50]}
                  style={{fontWeight: '600', marginLeft: 4}}
                  text={`${currency.symbol}${amount.toFixed(2)}`}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }, [expenses, filterCat]);

  const getCategoryData = catId => {
    const totalCatAmount = expenses
      .filter(exp => exp.category === catId)
      .reduce((acc, obj) => acc + obj.amount, 0);

    return {
      width: (totalCatAmount / totalAmount) * 100,
      amount: totalCatAmount,
    };
  };

  const getDetailContainer = useCallback(
    exp => {
      const {amount, category, createdAt, paidBy, title, _id} = exp;
      const {color} = EXPENSES_CATEGORY.find(cat => cat.id === category);
      const paidByUser = activeMembers.find(m => m.id === exp.paidBy);

      return (
        <View key={_id} style={styles.expenseSummary}>
          <View style={[styles.infoContainer, {backgroundColor: color}]} />
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Body type={4} text={title} />
              </View>
              <Headline
                type={4}
                text={`${currency.symbol}${amount.toFixed(2)}`}
              />
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
            {isSolo && (
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
            )}
          </View>
        </View>
      );
    },
    [expenses],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HybridHeader
        title={isSolo ? i18n.t('Analyze Expenses') : i18n.t('Settle Expenses')}
        scrollY={scrollY}>
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
            {expensesData?.map(exp => {
              return getDetailContainer(exp);
            })}
          </View>
        </View>
      </HybridHeader>
      {!isSolo && (
        <FAButton
          icon={'arrow-forward'}
          iconStyle={{marginLeft: -2}}
          iconSize={24}
          onPress={handleSettle}
        />
      )}

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
  catContainer: {
    backgroundColor: COLORS.shades[0],
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 4,
    marginTop: 6,
  },
});
