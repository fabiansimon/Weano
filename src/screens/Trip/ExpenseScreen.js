import {
  View, StyleSheet, FlatList,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useMutation } from '@apollo/client';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import i18n from '../../utils/i18n';
import HybridHeader from '../../components/HybridHeader';
import INFORMATION from '../../constants/Information';
import Headline from '../../components/typography/Headline';
import ExpenseTile from '../../components/Trip/ExpenseTile';
import Divider from '../../components/Divider';
import ExpensesContainer from '../../components/Trip/ExpenseContainer';
import FAButton from '../../components/FAButton';
import AddExpenseModal from '../../components/Trip/AddExpenseModal';
import ADD_EXPENSE from '../../mutations/addExpense';

export default function ExpenseScreen({ route }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const [addExpense, { loading, error }] = useMutation(ADD_EXPENSE);

  const [showTotal, setShowTotal] = useState(true);
  const [expenseData, setExpenseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myData, setMyData] = useState([]);

  useEffect(() => {
    setExpenseData(mockExpenses);
  }, []);

  useEffect(() => {
    extractMyData(expenseData);
  }, [expenseData]);

  const extractMyData = (data) => {
    setMyData(data.filter((expense) => expense.id === 'fabian simon'));
  };

  const getTotal = () => {
    let amount = 0;
    expenseData.forEach((expense) => {
      amount += expense.amount;
    });
    return amount;
  };

  const users = [
    {
      name: 'Fabian Simon',
      id: 'fabian simon',
      uri: 'https://i.pravatar.cc/300',
      status: true,
    },
    {
      name: 'Julia Stefan',
      id: 'julia stefan',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Matthias Betonmisha',
      id: 'matthias betonmisha',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Didi Chovookkaran',
      id: 'didi chovookkaran',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
    {
      name: 'Alexander Wieser',
      id: 'alexander wieser',
      uri: 'https://i.pravatar.cc/300',
      status: false,
    },
  ];

  const mockExpenses = [
    {
      id: 'fabian simon',
      amount: 123,
      description: 'Airbnb 🎂',
      timestamp: 1660998973,
    },
    {
      id: 'fabian simon',
      amount: 92,
      description: 'Snickers 🍫',
      timestamp: 1665504336,
    },
    {
      id: 'julia stefan',
      amount: 12,
      description: 'Pizza 🍕',
      timestamp: 1660994973,
    },
    {
      id: 'alexander wieser',
      amount: 99,
      description: 'Pass 🛂',
      timestamp: 1660998973,
    },
    {
      id: 'julia stefan',
      amount: 100,
      description: 'Cocaine 🏂',
      timestamp: 1660998973,
    },
    {
      id: 'didi chovookkaran',
      amount: 78,
      description: 'AGMO 👚',
      timestamp: 1660998973,
    },
    {
      id: 'matthias betonmisha',
      amount: 1,
      description: 'Beer 🍺',
      timestamp: 1660998973,
    },
  ];

  const handleAddExpense = async (data) => {
    setIsLoading(true);

    let { amount } = data;
    const { title } = data;
    amount = amount.replaceAll(',', '.');
    amount = parseFloat(amount);

    await addExpense({
      variables: {
        expense: {
          amount,
          title,
          tripId: '636e85cc1340c364d33f04c9',
        },
      },
    }).catch((e) => console.log(`ERROR: ${e.message}`))
      .then(() => {
        setIsLoading(false);
        setShowModal(false);
      });
  };

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
      style={{ marginHorizontal: 15 }}
      data={expense}
      user={users.find((user) => user.id === expense.id)}
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
            text={`$${getTotal()}`}
          />
          <Headline
            style={{ maringBottom: 26 }}
            type={4}
            text={i18n.t('total expenses')}
            color={COLORS.neutral[500]}
          />
          <ExpensesContainer
            style={{ marginTop: 30 }}
            data={expenseData}
            users={users}
          />
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
      <FAButton
        icon="add"
        iconSize={28}
        onPress={() => setShowModal(true)}
      />
      <AddExpenseModal
        isVisible={showModal}
        onRequestClose={() => setShowModal(false)}
        onPress={(data) => handleAddExpense(data)}
        isLoading={isLoading || loading}
      />
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
