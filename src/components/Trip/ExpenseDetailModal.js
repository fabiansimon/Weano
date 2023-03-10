import {
  Modal, StyleSheet, View, TouchableOpacity, ScrollView, Animated, Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import Headline from '../typography/Headline';
import Avatar from '../Avatar';
import Body from '../typography/Body';
import i18n from '../../utils/i18n';
import Button from '../Button';
import Utils from '../../utils';
import userStore from '../../stores/UserStore';

export default function ExpenseDetailModal({
  isVisible, onRequestClose, data, users, onDelete, onReminder, currency,
}) {
  // STORES
  const { id: userId } = userStore((state) => state.user);

  // STATE & MISC
  const [showModal, setShowModal] = useState(isVisible);
  const [members, setMembers] = useState([]);
  const [splitAmount, setSplitAmonut] = useState(null);
  const animatedScale = useRef(new Animated.Value(0)).current;

  const duration = 350;

  const isCreator = userId === data?.paidBy;
  const splitees = members.filter((member) => member.isIncluded);

  useEffect(() => {
    toggleModal();
  }, [isVisible]);

  useEffect(() => {
    setMembers(users.map((u) => ({
      ...u,
      isIncluded: false,
    })));
  }, [users]);

  useEffect(() => {
    const payingMembers = members.filter((member) => member.isIncluded).length;
    if (!payingMembers) {
      setSplitAmonut(null);
      return;
    }
    setSplitAmonut(data.amount / payingMembers);
  }, [members]);

  const toggleModal = () => {
    if (isVisible) {
      setShowModal(true);
      Animated.spring(animatedScale, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => {
        setShowModal(false);
        setMembers((prev) => prev.map((member) => ({
          ...member,
          isIncluded: false,
        })));
      }, duration - 100);
      Animated.spring(animatedScale, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start();
    }
  };

  const addToSplit = (splitee) => {
    const { id } = splitee;
    setMembers((prev) => prev.map((p) => ({
      ...p,
      isIncluded: p.id === id ? !p.isIncluded : p.isIncluded,
    })));
  };

  const handleDelete = async () => {
    Utils.showConfirmationAlert(
      i18n.t('Delete Expense'),
      i18n.t(`Are you sure you want to delete '${data.title}' as an expense?`),
      i18n.t('Delete'),
      async () => {
        onDelete(data);
      },
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
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onRequestClose}
        style={styles.container}
      >
        <Animated.View style={[styles.innerContainer, { transform: [{ scale: animatedScale }] }]}>
          <Avatar
            style={styles.avatar}
            isSelf
            size={35}
          />
          <Headline
            text={data?.title}
            style={{ paddingTop: 2 }}
            color={COLORS.neutral[700]}
            type={4}
          />
          <Headline
            text={`${currency?.symbol}${data?.amount}`}
            color={COLORS.neutral[700]}
            type={1}
          />
          <View style={[styles.splitContainer, { marginBottom: isCreator ? 20 : 0 }]}>
            <Pressable>
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: PADDING.s, marginVertical: 10,
              }}
              >
                <Body
                  type={2}
                  text={i18n.t('Split by')}
                  color={COLORS.neutral[500]}
                />
                {splitAmount ? (
                  <View style={{
                    borderRadius: RADIUS.xl,
                    backgroundColor: COLORS.primary[700],
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                  }}
                  >
                    <Body
                      type={2}
                      text={`${data?.currency}${splitAmount} ${i18n.t('per person')}`}
                      color={COLORS.shades[0]}
                    />
                  </View>
                ) : <View style={{ height: 27 }} />}
              </View>
              <ScrollView horizontal style={{ paddingLeft: PADDING.s, paddingBottom: 10 }}>
                {members.map((splitee) => (
                  <TouchableOpacity
                    onPress={() => addToSplit(splitee)}
                    activeOpacity={0.9}
                    style={{ alignItems: 'center', width: 50 }}
                  >
                    <View>
                      <Avatar
                        size={35}
                        disabled
                        data={splitee}
                      />
                      {splitee.isIncluded && (
                      <View style={styles.avatarOverlay}>
                        <Icon
                          name="checkmark-circle-outline"
                          size={22}
                          color={COLORS.shades[0]}
                        />
                      </View>
                      )}
                    </View>
                    <Body
                      type={2}
                      text={splitee?.firstName}
                      style={{ fontWeight: splitee.isIncluded ? '500' : '400', marginTop: 4 }}
                      color={splitee.isIncluded ? COLORS.shades[100] : COLORS.neutral[300]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </View>
          {isCreator && (
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => onReminder({
                  splitees,
                  currency: data?.currency,
                  amount: splitAmount,
                  title: data?.title,
                })}
                isDisabled={splitees.length <= 0}
                text={i18n.t('Send reminder')}
              />
              <Button
                style={{
                  marginLeft: 10,
                }}
                icon={(
                  <Icon
                    name="ios-trash-outline"
                    size={22}
                  />
                )}
                onPress={handleDelete}
                isSecondary
                fullWidth={false}
              />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  avatar: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  innerContainer: {
    width: '95%',
    paddingHorizontal: PADDING.m,
    paddingVertical: PADDING.l - 2,
    backgroundColor: COLORS.shades[0],
    borderRadius: RADIUS.m,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
  },
  splitContainer: {
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.s,
    borderWidth: 1,
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  avatarOverlay: {
    position: 'absolute',
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.5),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    flex: 1,
  },
});
