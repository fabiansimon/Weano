import {
  View, StyleSheet, FlatList,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Animated from 'react-native-reanimated';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Headline from '../../components/typography/Headline';
import ExpenseTile from '../../components/Trip/ExpenseTile';
import Divider from '../../components/Divider';
import ExpenseDetailModal from '../../components/Trip/ExpenseDetailModal';

export default function IndividualExpenseScreen({ route }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedExpense, setSelectedExpense] = useState({ isVisible: false, data: null });
  const { data, users } = route.params;
  const getExpenseTile = (expense) => (
    <ExpenseTile
      onPress={() => setSelectedExpense({
        isVisible: true,
        data: expense,
      })}
      data={expense}
      user={data.user}
    />
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={`${data.user.firstName}'s ${i18n.t('Expenses')}`}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={{ marginHorizontal: PADDING.l }}>
          <Headline
            style={{ marginTop: 26 }}
            type={1}
            text={`$${data.amount}`}
          />
          <Headline
            style={{ maringBottom: 26 }}
            type={4}
            text={i18n.t('total expenses')}
            color={COLORS.neutral[500]}
          />

          <FlatList
            style={{ paddingTop: 50 }}
            contentContainerStyle={{ paddingBottom: 20 }}
            data={data.expenses || null}
            renderItem={({ item }) => getExpenseTile(item)}
                // eslint-disable-next-line react/no-unstable-nested-components
            ItemSeparatorComponent={() => (
              <Divider
                style={{ marginLeft: 60 }}
                color={COLORS.neutral[50]}
                vertical={14}
              />
            )}
          />
        </View>
      </HybridHeader>
      <ExpenseDetailModal
        isVisible={selectedExpense.isVisible}
        onRequestClose={() => setSelectedExpense((prev) => ({
          ...prev,
          isVisible: false,
        }))}
        users={users}
        data={selectedExpense.data}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    marginTop: 8,
    height: 4,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[500],
    zIndex: 2,
  },
  inactiveTab: {
    marginTop: 9,
    height: 1,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[50],
    zIndex: 2,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  summaryContainer: {
    marginTop: 25,
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: COLORS.neutral[50],
    marginBottom: 70,
  },
});
