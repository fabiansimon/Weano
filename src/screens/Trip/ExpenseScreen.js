import {
  View, StyleSheet, FlatList, ScrollView,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Headline from '../../components/typography/Headline';
import ExpenseIndividualCard from '../../components/Trip/ExpenseIndividualCard';
import ExpenseTile from '../../components/Trip/ExpenseTile';
import Divider from '../../components/Divider';
import ROUTES from '../../constants/Routes';

export default function ExpenseScreen() {
  const [showTotal, setShowTotal] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [expenseData, setExpenseData] = useState([]);
  const [myData, setMyData] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    setExpenseData(mockData);
    extractMyData();
  }, []);

  const extractMyData = (data) => {
    const d = data || expenseData;
    setMyData(d.filter((expense) => expense.user === 'Fabian'));
  };

  const extractIndividualData = (user) => {
    const { amount } = getAmount(user);
    const expenses = expenseData.filter((expense) => expense.id === user.id);
    return {
      user,
      amount,
      expenses,
    };
  };

  const getAmount = (user) => {
    let amount = 0;
    expenseData.forEach((expense) => {
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

  const users = [
    {
      name: 'Fabian',
      id: 'fabian',
    },
    {
      name: 'Julia',
      id: 'julia',
    },
    {
      name: 'Alexander',
      id: 'alexander',
    },
    {
      name: 'Didi',
      id: 'didi',
    },
    {
      name: 'Matthias',
      id: 'matthias',
    },
  ];

  const mockData = [
    {
      user: 'Fabian',
      id: 'fabian',
      amount: 123,
      description: 'Airbnb 🎂',
      timestamp: 1660998973,
    },
    {
      user: 'Julia',
      id: 'julia',
      amount: 12,
      description: 'Pizza 🍕',
      timestamp: 1660994973,
    },
    {
      user: 'Alexander',
      id: 'alexander',
      amount: 99,
      description: 'Pass 🛂',
      timestamp: 1660998973,
    },
    {
      user: 'Julia',
      id: 'julia',
      amount: 100,
      description: 'Cocaine 🏂',
      timestamp: 1660998973,
    },
    {
      user: 'Didi',
      id: 'did',
      amount: 78,
      description: 'AGMO 👚',
      timestamp: 1660998973,
    },
    {
      user: 'Matthias',
      id: 'matthias',
      amount: 1,
      description: 'Beer 🍺',
      timestamp: 1660998973,
    },
  ];

  const getListHeader = () => (
    <View style={{
      flexDirection: 'row', marginTop: 16,
    }}
    >
      <TouchableOpacity
        onPress={() => setShowTotal(true)}
        activeOpacity={0.9}
        style={{ flex: 1 }}
      >
        <Headline
          type={4}
          style={{ alignSelf: 'center' }}
          color={showTotal ? COLORS.primary[700] : COLORS.neutral[300]}
          text={i18n.t('Total')}
        />
        <View style={showTotal ? styles.activeTab : styles.inactiveTab} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setShowTotal(false)}
        activeOpacity={0.9}
        style={{ flex: 1 }}
      >
        <Headline
          type={4}
          style={{ alignSelf: 'center' }}
          color={!showTotal ? COLORS.primary[700] : COLORS.neutral[300]}
          text={i18n.t('You')}
        />
        <View style={!showTotal ? styles.activeTab : styles.inactiveTab} />
      </TouchableOpacity>
    </View>
  );

  const getExpenseTile = (expense) => (
    <ExpenseTile
      style={{ paddingHorizontal: 15 }}
      data={expense}
    />
  );

  return (
    <View style={styles.container}>
      <HybridHeader
        title={i18n.t('Expenses')}
        scrollY={scrollY}
        info={INFORMATION.dateScreen}
      >
        <View style={{ marginHorizontal: PADDING.l }}>
          <Headline
            style={{ marginTop: 26 }}
            type={1}
            text={`$${getAmount().amount}`}
          />
          <Headline
            style={{ maringBottom: 26 }}
            type={4}
            text={i18n.t('total expenses')}
            color={COLORS.neutral[500]}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -PADDING.l, paddingHorizontal: PADDING.l, marginTop: 30 }}
          >
            {users.map((user, index) => {
              const individualData = extractIndividualData(user);
              return (
                <ExpenseIndividualCard
                  onPress={() => navigation.navigate(ROUTES.individualExpenseScreen, { data: individualData })}
                  data={individualData}
                  style={{ marginRight: index === users.length - 1 ? 40 : 10 }}
                />
              );
            })}
          </ScrollView>
          <View style={styles.summaryContainer}>
            {getListHeader()}
            <FlatList
              style={{ paddingTop: 20 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              data={showTotal ? expenseData : myData}
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
        </View>
      </HybridHeader>
    </View>
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
    borderRadius: RADIUS.l,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    marginBottom: 70,
  },
});
