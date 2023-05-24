import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
  Pressable,
} from 'react-native';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';
import Divider from '../Divider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../Button';

function SettleModal({
  isVisible,
  onRequestClose,
  data,
  activeMembers,
  currency = '$',
}) {
  // STATE && MISC
  const [transactions, setTransactions] = useState([
    {
      amount: 199.22,
      from: 'Fabian',
      to: 'Julia',
    },
    {
      amount: 199.22,
      from: 'Fabian',
      to: 'Julia',
    },
    {
      amount: 199.22,
      from: 'Fabian',
      to: 'Julia',
    },
    {
      amount: 199.22,
      from: 'Fabian',
      to: 'Julia',
    },
    {
      amount: 199.22,
      from: 'Fabian',
      to: 'Julia',
    },
  ]);
  const [showModal, setShowModal] = useState(isVisible);
  const animatedBottom = useRef(new Animated.Value(900)).current;
  const duration = 300;

  const calculateTotalCosts = () => {
    let memberCosts = [];

    let i = 0;
    while (activeMembers[i]) {
      const {id, firstName} = activeMembers[i];

      let paid = 0;
      let debt = 0;

      data.forEach(expense => {
        const {amount, paidBy, splitBy} = expense;

        // If user paid for expense
        if (id === paidBy) {
          paid += amount;
        }

        // If user owes for expense
        if (splitBy.includes(id)) {
          debt += amount / splitBy?.length;
        }
      });

      memberCosts.push({
        name: firstName,
        id,
        paid,
        debt,
        diff: paid - debt,
      });
      i++;
    }

    let debtMembers = memberCosts
      .filter(m => m.diff < 0)
      .sort((a, b) => a.diff - b.diff);
    let richMembers = memberCosts
      .filter(m => m.diff >= 0)
      .sort((a, b) => a.diff - b.diff);

    for (const member of richMembers) {
    }

    console.log(debtMembers);
    console.log(richMembers);
  };

  useEffect(() => {
    calculateTotalCosts();
  }, [isVisible]);

  useEffect(() => {
    toggleModal();
  }, [isVisible]);

  const toggleModal = () => {
    if (isVisible) {
      setShowModal(true);
      Animated.spring(animatedBottom, {
        toValue: 100,
        duration,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), duration);
      Animated.spring(animatedBottom, {
        toValue: 900,
        duration,
        useNativeDriver: true,
      }).start();
    }
  };

  const getTransactionTile = (transaction, index) => {
    const {amount, from, to} = transaction;
    const i = 10;
    return (
      <Pressable
        style={[
          styles.tile,
          {borderBottomWidth: index === transactions.length - 1 ? 0 : 1},
        ]}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Body type={1} text={i18n.t('From')} color={COLORS.neutral[300]} />
            <Body
              type={1}
              text={from}
              color={COLORS.shades[100]}
              style={{marginLeft: 4}}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Body type={1} text={i18n.t('To')} color={COLORS.neutral[300]} />
            <Body
              type={1}
              text={to}
              color={COLORS.shades[100]}
              style={{marginLeft: 4}}
            />
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Body
            type={1}
            text={`${currency}${amount}`}
            color={COLORS.shades[0]}
            style={{fontWeight: '500'}}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <Modal
      animationType="fade"
      visible={showModal}
      useNativeDriver
      collapsable
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.container]}
        onPress={onRequestClose}>
        <Animated.View
          style={[styles.content, {transform: [{translateY: animatedBottom}]}]}>
          <View style={styles.handler} />
          <View style={styles.innerContainer}>
            <Headline type={4} text={i18n.t('Fastest way to settle')} />
            <Body
              type={2}
              style={{marginTop: 2}}
              color={COLORS.neutral[300]}
              text={i18n.t(
                'That way everybody will have paid what they owed in the quickest way possible.',
              )}
            />
            <Divider style={{marginHorizontal: -PADDING.m, marginBottom: 0}} />
            {transactions.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {transactions.map((transaction, index) => {
                  return getTransactionTile(transaction, index);
                })}
              </ScrollView>
            ) : (
              <View />
            )}
            <View style={styles.speedContainer}>
              <Body
                type={2}
                style={{marginTop: -1, padding: 10, flex: 1}}
                color={COLORS.neutral[700]}
                text={`${i18n.t('Everything settled with only')} ${
                  transactions.length
                } ${i18n.t('transactions')}`}
              />
              <Icon
                name="bolt"
                size={24}
                style={{marginRight: 4}}
                color={COLORS.neutral[900]}
              />
            </View>
            <Divider style={{marginHorizontal: -PADDING.m, marginBottom: 0}} />
            <View
              style={{
                height: 50,
                flexDirection: 'row',
                marginTop: 12,
                marginBottom: -4,
              }}>
              <Button text={i18n.t('Share')} style={{marginRight: 5}} />
              <Button
                isSecondary
                text={i18n.t('Remind')}
                style={{marginLeft: 5}}
              />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    marginTop: 'auto',
    padding: PADDING.s,
    opacity: 1,
    marginBottom: 30,
    paddingBottom: 100,
  },
  innerContainer: {
    overflow: 'hidden',
    maxHeight: '100%',
    paddingVertical: 14,
    paddingHorizontal: PADDING.m,
    backgroundColor: COLORS.shades[0],
    paddingBottom: 20,
    borderRadius: RADIUS.m,
  },
  handler: {
    width: 50,
    height: 6,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[100],
    marginBottom: 10,
    alignSelf: 'center',
  },
  tile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 65,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
  },
  amountContainer: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  speedContainer: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default SettleModal;
