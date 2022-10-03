import {
  ScrollView, View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import COLORS, { PADDING } from '../../constants/Theme';
import ExpenseIndividualCard from './ExpenseIndividualCard';
import ROUTES from '../../constants/Routes';

export default function ExpensesContainer({
  style, data, users, tileBackground = COLORS.neutral[50],
}) {
  const navigation = useNavigation();

  const extractIndividualData = (user) => {
    const { amount } = getAmount(user);
    const expenses = data.filter((expense) => expense.id === user.id);
    return {
      user,
      amount,
      expenses,
    };
  };

  const getAmount = (user) => {
    let amount = 0;
    data.forEach((expense) => {
      if (user) {
        if (expense.id === user.id) {
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -PADDING.l, paddingHorizontal: PADDING.l }}
      >
        {users.map((user, index) => {
          const individualData = extractIndividualData(user);
          return (
            <ExpenseIndividualCard
              onPress={() => navigation.navigate(ROUTES.individualExpenseScreen, { data: individualData })}
              data={individualData}
              style={{ marginRight: index === users.length - 1 ? 40 : 10, backgroundColor: tileBackground }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
