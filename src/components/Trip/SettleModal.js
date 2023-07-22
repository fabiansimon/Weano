import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';
import Divider from '../Divider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../Button';
import userStore from '../../stores/UserStore';

function SettleModal({
  isVisible,
  onRequestClose,
  data,
  activeMembers,
  tripTitle,
  currency = '$',
}) {
  // STORES
  const {id} = userStore(state => state.user);

  // STATE && MISC
  const [transactions, setTransactions] = useState([]);
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

    memberCosts.sort((a, b) => b.diff - a.diff);

    let t = [];
    for (let j = 0; j < memberCosts.length; j++) {
      const currMember = memberCosts[j];

      while (currMember.diff !== 0) {
        const settleMember = memberCosts.find(m => m.diff < 0);

        if (!settleMember) {
          break;
        }

        let diff;
        let amount;

        if (Math.abs(currMember.diff) < Math.abs(settleMember.diff)) {
          diff =
            Math.abs(currMember.diff) - Math.abs(settleMember.diff).toFixed(10);
          amount = Math.abs(currMember.diff).toFixed(2);
          currMember.diff = 0;
          settleMember.diff = diff;
        } else if (Math.abs(currMember.diff) > Math.abs(settleMember.diff)) {
          amount = Math.abs(settleMember.diff).toFixed(2);
          currMember.diff = (
            Math.abs(currMember.diff) - Math.abs(settleMember.diff)
          ).toFixed(10);
          settleMember.diff = 0;
        } else if (Math.abs(currMember.diff) === Math.abs(settleMember.diff)) {
          amount = Math.abs(currMember.diff).toFixed(2);
          currMember.diff = 0;
          settleMember.diff = 0;
        }

        t.push({
          from: {
            id: settleMember.id,
            name: settleMember.name,
          },
          to: {
            id: currMember.id,
            name: currMember.name,
          },
          amount,
        });
      }
    }

    setTransactions(t.filter(t => t.amount !== '0.00'));
  };

  useEffect(() => {
    if (isVisible) {
      calculateTotalCosts();
    }
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

  const handleShare = () => {
    let message = `The fastest way to settle all expenses from the trip "${tripTitle}" is following: \n\n`;
    const now = new Date();

    message += `(Created: ${now.toDateString()})\n\n`;

    for (const transaction of transactions) {
      message += `${transaction.from.name} --> ${transaction.to.name}: ${currency}${transaction.amount}\n`;
    }

    Share.share({
      message,
    });
  };

  const getTransactionTile = (transaction, index) => {
    const {
      amount,
      from: {name: fromName, id: fromId},
      to: {name: toName, id: toId},
    } = transaction;

    const isReceiver = toId === id;
    const isSender = fromId === id;

    const amountColor = isReceiver
      ? COLORS.success[700]
      : isSender
      ? COLORS.error[900]
      : COLORS.neutral[700];
    return (
      <Pressable
        style={[
          styles.tile,
          {borderBottomWidth: index === transactions.length - 1 ? 0 : 1},
        ]}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Body type={1} text={i18n.t('From')} color={COLORS.neutral[300]} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 6,
              }}>
              <Body
                type={1}
                text={isSender ? i18n.t('You') : fromName}
                color={COLORS.shades[100]}
              />
              {isSender && (
                <Icon name="person" size={16} style={{marginLeft: 3}} />
              )}
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Body type={1} text={i18n.t('To')} color={COLORS.neutral[300]} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 6,
              }}>
              <Body
                type={1}
                text={isReceiver ? i18n.t('You') : toName}
                color={COLORS.shades[100]}
              />
              {isReceiver && (
                <Icon name="person" size={16} style={{marginLeft: 3}} />
              )}
            </View>
          </View>
        </View>
        <View
          style={[
            styles.amountContainer,
            {
              backgroundColor: amountColor,
            },
          ]}>
          <Body
            type={1}
            text={`${
              isReceiver ? '+' : isSender ? '-' : ''
            }${currency}${amount}`}
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
              <Button
                onPress={handleShare}
                text={i18n.t('Share')}
                style={{marginRight: 5}}
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
