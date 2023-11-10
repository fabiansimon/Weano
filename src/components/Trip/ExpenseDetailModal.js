import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import Headline from '../typography/Headline';
import Avatar from '../Avatar';
import Body from '../typography/Body';
import i18n from '../../utils/i18n';
import Button from '../Button';
import Utils from '../../utils';
import userStore from '../../stores/UserStore';
import userManagement from '../../utils/userManagement';
import CategoryChip from '../CategoryChip';
import EXPENSES_CATEGORY from '../../constants/ExpensesCategories';

export default function ExpenseDetailModal({
  isVisible,
  onRequestClose,
  data,
  users,
  onDelete,
  onEdit,
  currency,
}) {
  // STORES
  const {id: userId} = userStore(state => state.user);

  // STATE & MISC
  const [showModal, setShowModal] = useState(isVisible);
  const animatedScale = useRef(new Animated.Value(0)).current;

  const duration = 350;

  const isCreator = userId === data?.paidBy;
  const {avatarUri, firstName} = userManagement.convertIdToUser(data?.paidBy);

  const splitAmount =
    data?.splitBy?.length > 0
      ? (data?.amount / data.splitBy.length).toFixed(2)
      : 0;

  useEffect(() => {
    toggleModal();
  }, [isVisible]);

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
      }, duration - 100);
      Animated.spring(animatedScale, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start();
    }
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

  const categoryData = useMemo(() => {
    if (!data?.category) {
      return EXPENSES_CATEGORY.find(cat => cat.id === 'other');
    }
    return EXPENSES_CATEGORY.find(cat => cat.id === data.category);
  }, [data]);

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
        onPress={onRequestClose}
        style={styles.container}>
        <Animated.View
          style={[
            styles.innerContainer,
            {transform: [{scale: animatedScale}]},
          ]}>
          <Avatar style={styles.avatar} avatarUri={avatarUri} size={35} />
          <Headline text={data?.title} color={COLORS.neutral[700]} type={4} />

          <Headline
            text={`${currency?.symbol}${data?.amount}`}
            color={COLORS.neutral[700]}
            type={1}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: -10,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <Body
              text={`${i18n.t('Paid by')} ${
                firstName || i18n.t('deleted user')
              }`}
              color={COLORS.neutral[300]}
              type={2}
            />
            <CategoryChip
              style={{height: 30}}
              string={categoryData.title}
              color={categoryData.color}
            />
          </View>
          <View
            style={[styles.splitContainer, {marginBottom: isCreator ? 20 : 0}]}>
            <Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: PADDING.s,
                  marginVertical: 10,
                  justifyContent: 'space-between',
                }}>
                <Body
                  type={2}
                  text={i18n.t('Split between')}
                  color={COLORS.neutral[500]}
                />
                <Body
                  type={2}
                  style={{marginLeft: 4, fontWeight: '500'}}
                  text={`${data?.splitBy?.length} ${i18n.t('Travelers')}`}
                  color={COLORS.shades[100]}
                />
              </View>
              <ScrollView
                horizontal
                style={{paddingLeft: PADDING.s, paddingBottom: 10}}>
                {users.map(user => {
                  const isIncluded = data?.splitBy?.includes(user.id);

                  return (
                    <Pressable
                      key={user.id}
                      style={{
                        opacity: isIncluded ? 1 : 0.2,
                        alignItems: 'center',
                        width: 48,
                        marginRight: 4,
                      }}>
                      <Avatar size={35} disabled data={user} />
                      <Body
                        type={2}
                        text={user?.firstName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          marginTop: 4,
                          textDecorationLine: !isIncluded
                            ? 'line-through'
                            : 'none',
                        }}
                        color={COLORS.neutral[500]}
                      />
                    </Pressable>
                  );
                })}
              </ScrollView>
              <View
                style={{
                  marginTop: 6,
                  borderTopColor: COLORS.neutral[100],
                  borderTopWidth: 1,
                  height: 35,
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Body
                    type={2}
                    style={{fontWeight: '500'}}
                    text={`${data?.currency}${splitAmount} ${i18n.t(
                      'per person',
                    )}`}
                    color={COLORS.shades[100]}
                  />
                </View>
              </View>
            </Pressable>
          </View>
          {isCreator && (
            <View style={styles.buttonContainer}>
              <Button onPress={() => onEdit(data)} text={i18n.t('Edit')} />
              <Button
                style={{
                  marginLeft: 10,
                }}
                icon={
                  <Icon
                    color={COLORS.shades[100]}
                    name="ios-trash-outline"
                    size={22}
                  />
                }
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
    marginTop: 14,
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
