import React, {useRef, useState, useCallback} from 'react';
import EntIcon from 'react-native-vector-icons/Entypo';
import Animated from 'react-native-reanimated';
import HybridHeader from '../components/HybridHeader';
import {ScrollView, StyleSheet, TouchableHighlight, View} from 'react-native';
import i18n from '../utils/i18n';
import COLORS, {PADDING, RADIUS} from '../constants/Theme';
import Body from '../components/typography/Body';
import Headline from '../components/typography/Headline';
import EXPENSES_CATEGORY from '../constants/ExpensesCategories';
import Avatar from '../components/Avatar';
import userManagement from '../utils/userManagement';
import Utils from '../utils';
import SplitExpenseContainer from '../components/Trip/SplitExpenseContainer';

export default function SettleExpensesScreen({route}) {
  const {expenses, totalAmount, currency, users: activeMembers} = route.params;

  // STATE & MISC
  const [detailedExpenses, setDetailedExpenses] = useState(
    expenses.map(exp => {
      return {
        ...exp,
        splitBy: activeMembers.map(member => member.id),
      };
    }),
  );
  const scrollY = useRef(new Animated.Value(0)).current;

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
            text={`${
              userManagement.convertIdToUser(paidBy).firstName
            }, ${Utils.getDateFromTimestamp(createdAt / 1000, 'DD/MM/YY')}`}
            color={COLORS.neutral[300]}
            style={{marginTop: 2}}
          />
          <SplitExpenseContainer
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
      <HybridHeader title={i18n.t('Settle Expenses')} scrollY={scrollY}>
        <View style={{marginTop: 10, marginHorizontal: PADDING.l}}>
          <Headline type={1} text={`${currency.symbol}${totalAmount}`} />
          <Body
            type={4}
            style={{marginTop: -2}}
            text={i18n.t('total expenses')}
            color={COLORS.neutral[300]}
          />
          {getLinearBar()}
          <View style={styles.summaryContainer}>
            {detailedExpenses.map(exp => {
              return getDetailContainer(exp);
            })}
          </View>
        </View>
      </HybridHeader>
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
  sharedByContainer: {
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.s,
    paddingHorizontal: 10,
    marginTop: 10,
    paddingVertical: 4,
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
    marginBottom: 10,
  },
});
