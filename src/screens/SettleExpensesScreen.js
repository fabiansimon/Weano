import React, {useRef, useState, useCallback} from 'react';
import Animated, {exp} from 'react-native-reanimated';
import HybridHeader from '../components/HybridHeader';
import {Alert, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
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

const {width} = Dimensions.get('window');

export default function SettleExpensesScreen({route}) {
  // PARAMS
  const {totalAmount} = route.params;

  // STORES
  const {expenses, activeMembers, currency} = activeTripStore(
    state => state.activeTrip,
  );

  // STATE & MISC
  const [editExpense, setEditExpense] = useState(null);
  const [testSettle, setTestSettle] = useState();
  const [scrollIndex, setScrollIndex] = useState(0);
  const pageRef = useRef();

  const scrollY = useRef(new Animated.Value(0)).current;

  const calculateTotalCosts = () => {
    let memberCosts = [];

    let i = 0;
    while (activeMembers[i + 1]) {
      const {id, firstName} = activeMembers[i];

      let spent = 0;
      let owed = 0;

      expenses.forEach(expense => {
        const {amount, paidBy, splitBy} = expense;

        // If user paid for expense
        if (id === paidBy) {
          spent += amount;
        }

        // If user owes for expense
        if (splitBy.includes(id)) {
          owed += amount / splitBy?.length;
        }
      });

      memberCosts.push({
        name: firstName,
        id,
        totalSpent: spent,
        totalOwed: owed,
        isOwed: spent > owed,
      });

      let debtMembers = [...memberCosts.filter(m => !m.isOwed)];
      let richMembers = [...memberCosts.filter(m => m.isOwed)];

      setTestSettle([...debtMembers, ...richMembers]);

      console.log(debtMembers);
      console.log(richMembers);

      i++;
    }

    console.log(memberCosts);
  };

  const scrollPage = i => {
    setScrollIndex(i);
    pageRef?.current?.scrollTo({x: i === 0 ? 0 : 1000});
  };

  const handleSettle = () => {
    if (expenses.find(exp => exp.splitBy.length <= 0)) {
      return Alert.alert(
        i18n.t('Whoops'),
        i18n.t(
          'There are expenses without any splitees. Before settling please make sure to add them.',
        ),
      );
    }

    scrollPage(1);
    calculateTotalCosts();
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
    const paidByUser = userManagement.convertIdToUser(paidBy);

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
            text={`${paidByUser.firstName}, ${Utils.getDateFromTimestamp(
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
      <HybridHeader
        onPressBack={scrollIndex === 1 ? () => scrollPage(0) : null}
        title={i18n.t('Settle Expenses')}
        scrollY={scrollY}>
        <ScrollView
          ref={node => {
            pageRef.current = node;
          }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            width: width * 2,
          }}>
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
              {expenses.map(exp => {
                return getDetailContainer(exp);
              })}
            </View>
          </View>
          <View style={styles.innerContainer}>
            <Body
              type={4}
              style={{marginTop: -2}}
              text={i18n.t('Who owes who')}
              color={COLORS.neutral[300]}
            />
            <Body
              type={4}
              style={{marginTop: -2}}
              text={JSON.stringify(testSettle)}
              color={COLORS.neutral[300]}
            />
            <View />
          </View>
        </ScrollView>
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
        expenses={expenses}
        activeMembers={activeMembers}
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
