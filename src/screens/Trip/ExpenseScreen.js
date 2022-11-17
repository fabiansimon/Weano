import {
  View, StyleSheet, FlatList,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useMutation } from '@apollo/client';
import Toast from 'react-native-toast-message';
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
import Body from '../../components/typography/Body';
import userStore from '../../stores/UserStore';
import activeTripStore from '../../stores/ActiveTripStore';

export default function ExpenseScreen({ route }) {
  const { expenses, tripId } = route.params;

  const user = userStore((state) => state.user);

  const scrollY = useRef(new Animated.Value(0)).current;

  const [addExpense, { loading, error }] = useMutation(ADD_EXPENSE);

  const updateActiveTrip = activeTripStore((state) => state.updateActiveTrip);

  const [showTotal, setShowTotal] = useState(true);
  const [expenseData, setExpenseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [myData, setMyData] = useState([]);

  useEffect(() => {
    setExpenseData(expenses);
  }, []);

  useEffect(() => {
    extractMyData(expenseData);
  }, [expenseData]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: i18n.t('Whoops!'),
          text2: error.message,
        });
      }, 500);
    }
  }, [error]);

  const extractMyData = (data) => {
    setMyData(data.filter((expense) => expense.creatorId === user.id));
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
      id: user.id,
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
          tripId,
        },
      },
    }).catch((e) => console.log(`ERROR: ${e.message}`));
    setIsLoading(false);
    setShowModal(false);
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

  const getExpenseTile = (expense) => {
    const userData = users.find((u) => u.id === expense.creatorId);

    return (
      <ExpenseTile
        style={{ marginHorizontal: 15 }}
        data={expense}
        user={userData}
      />
    );
  };

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
              ListEmptyComponent={(
                <Body
                  style={{ textAlign: 'center', marginTop: 0 }}
                  text={i18n.t('No expenses yet')}
                  color={COLORS.neutral[300]}
                />
              )}
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
