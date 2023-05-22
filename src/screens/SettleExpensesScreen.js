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

  const getPersonTile = (user, isIncluded) => {
    const {avatarUri, firstName} = user;
    return (
      <View style={styles.splitByContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Avatar size={20} avatarUri={avatarUri} />
          <Body type={1} style={{marginLeft: 6}} text={firstName} />
        </View>
        <View
          style={[
            styles.checkbox,
            {
              borderWidth: isIncluded ? 0 : 1,
              backgroundColor: isIncluded ? COLORS.success[500] : 'transparent',
            },
          ]}>
          <EntIcon name="check" color={COLORS.shades[0]} size={16} />
        </View>
      </View>
    );
  };

  const getDetailContainer = exp => {
    const {amount, category, createdAt, paidBy, title, splitBy} = exp;
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
          <TouchableHighlight
            onPress={() => console.log('2s')}
            underlayColor={COLORS.neutral[50]}
            style={styles.sharedByContainer}>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Body
                  type={2}
                  text={'Shared equally between'}
                  color={COLORS.neutral[300]}
                  style={{marginTop: 2}}
                />
                {/* <Body
                        type={2}
                        text={'status'}
                        color={COLORS.neutral[300]}
                        style={{marginTop: 2}}
                      /> */}
              </View>
              {activeMembers?.map(member =>
                getPersonTile(member, exp.splitBy.includes(member.id)),
              )}

              <View style={styles.bottomSummaryContainer}>
                <Body
                  type={2}
                  text={'Amount per person'}
                  color={COLORS.neutral[300]}
                  style={{marginTop: 2}}
                />
                <Body
                  type={2}
                  text={`${currency.symbol}${amount / splitBy.length}`}
                  color={COLORS.shades[100]}
                  style={{marginTop: 2, fontWeight: '500'}}
                />
              </View>
            </>
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  const getSummaryContainer = () => {
    return (
      <ScrollView style={styles.summaryContainer}>
        {detailedExpenses.map(exp => {
          return getDetailContainer(exp);
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <HybridHeader title={i18n.t('Settle Expenses')} scrollY={scrollY}>
        <View style={{marginHorizontal: PADDING.l}}>
          <View style={{marginTop: 10}}>
            <Headline type={1} text={`${currency.symbol}${totalAmount}`} />
            <Body
              type={4}
              style={{marginTop: -2}}
              text={i18n.t('total expenses')}
              color={COLORS.neutral[300]}
            />
            {getLinearBar()}
            {getSummaryContainer()}
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
  checkbox: {
    borderColor: COLORS.neutral[300],
    borderRadius: 8,
    borderWidth: 1,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  bottomSummaryContainer: {
    marginHorizontal: -PADDING.s,
    paddingHorizontal: 10,
    height: 37.5,
    alignItems: 'center',
    borderTopColor: COLORS.neutral[100],
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  splitByContainer: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
