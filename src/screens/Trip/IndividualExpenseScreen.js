import {View, StyleSheet, FlatList} from 'react-native';
import React, {useRef, useState} from 'react';
import Animated from 'react-native-reanimated';
import COLORS, {PADDING} from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Headline from '../../components/typography/Headline';
import ExpenseTile from '../../components/Trip/ExpenseTile';
import Divider from '../../components/Divider';
import ExpenseDetailModal from '../../components/Trip/ExpenseDetailModal';
import Body from '../../components/typography/Body';

export default function IndividualExpenseScreen({route}) {
  // PARAMS
  const {data, users, currency} = route.params;

  // STATE & MISC
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedExpense, setSelectedExpense] = useState({
    isVisible: false,
    data: null,
  });

  const getExpenseTile = expense => (
    <ExpenseTile
      currency={currency}
      onDelete={null}
      data={expense}
      user={data.user}
    />
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={`${data.user.firstName}'s ${i18n.t('Expenses')}`}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}>
        <View style={{marginHorizontal: PADDING.l}}>
          <Headline
            style={{marginTop: 26}}
            type={1}
            text={`${currency?.symbol}${data.amount.toFixed(2)}`}
          />
          <Body
            style={{marginBottom: 16}}
            type={1}
            text={i18n.t('total expenses')}
            color={COLORS.neutral[300]}
          />

          <FlatList
            inverted
            style={{paddingTop: 50}}
            contentContainerStyle={{paddingBottom: 20}}
            data={data.expenses || null}
            renderItem={({item}) => getExpenseTile(item)}
            // eslint-disable-next-line react/no-unstable-nested-components
            ItemSeparatorComponent={() => (
              <Divider
                style={{marginLeft: 60}}
                color={COLORS.neutral[50]}
                vertical={14}
              />
            )}
          />
        </View>
      </HybridHeader>
      <ExpenseDetailModal
        currency={currency}
        isVisible={selectedExpense.isVisible}
        onRequestClose={() =>
          setSelectedExpense(prev => ({
            ...prev,
            isVisible: false,
          }))
        }
        users={users}
        data={selectedExpense.data}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
});
