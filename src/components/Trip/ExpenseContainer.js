import {ScrollView, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import COLORS, {PADDING} from '../../constants/Theme';
import ExpenseIndividualCard from './ExpenseIndividualCard';
import ROUTES from '../../constants/Routes';
import activeTripStore from '../../stores/ActiveTripStore';

export default function ExpensesContainer({
  style,
  tileBackground = COLORS.neutral[50],
  showIndividual,
}) {
  // STORES
  const {
    expenses: data,
    activeMembers: users,
    currency,
  } = activeTripStore(state => state.activeTrip);

  const navigation = useNavigation();

  const extractIndividualData = user => {
    const {amount} = getAmount(user);
    const expenses = data.filter(expense => expense.paidBy === user.id);
    return {
      user,
      amount,
      expenses,
    };
  };

  const getAmount = user => {
    let amount = 0;
    data.forEach(expense => {
      if (user) {
        if (expense.paidBy === user.id) {
          amount += expense.amount;
        }
      } else {
        amount += expense.amount;
      }
    });
    return {
      user: user || null,
      amount,
    };
  };

  return (
    <View style={style}>
      {data && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginHorizontal: -PADDING.l, paddingHorizontal: PADDING.l}}>
          {users.map((user, index) => {
            const individualData = extractIndividualData(user);
            return (
              <ExpenseIndividualCard
                currency={currency}
                onPress={() =>
                  showIndividual
                    ? navigation.navigate(ROUTES.individualExpenseScreen, {
                        data: individualData,
                        users,
                        currency,
                      })
                    : navigation.navigate(ROUTES.expenseScreen)
                }
                data={individualData}
                user={user}
                style={{
                  marginRight: index === users.length - 1 ? 40 : 10,
                  backgroundColor: tileBackground,
                }}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
