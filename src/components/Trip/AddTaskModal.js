import {
  Modal, StyleSheet, View, TouchableOpacity, Animated, TextInput, ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import KeyboardView from '../KeyboardView';
import Divider from '../Divider';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';
import Avatar from '../Avatar';
import Subtitle from '../typography/Subtitle';
import Utils from '../../utils';
import activeTripStore from '../../stores/ActiveTripStore';

export default function AddTaskModal({
  isVisible, onRequestClose, onPress,
}) {
  const { activeMembers: users } = activeTripStore((state) => state.activeTrip);
  const [isPrivate, setIsPrivate] = useState(true);
  const [task, setTask] = useState('');
  const [showModal, setShowModal] = useState(isVisible);
  const [assigneIndex, setAssigneIndex] = useState(0);
  const animatedBottom = useRef(new Animated.Value(900)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const duration = 300;

  useEffect(() => {
    setIsPrivate(true);
    setAssigneIndex(0);
    toggleModal();
  }, [isVisible, users]);

  useEffect(() => {
    toggleExpand();
  }, [isPrivate]);

  const toggleExpand = () => {
    if (!isPrivate) {
      Animated.spring(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: false,

      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: 100,
        duration,
        useNativeDriver: false,
      }).start();
    }
  };

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

  const handlePress = () => {
    if (task.trim().length <= 0) {
      console.log('No text');
      return;
    }

    const taskData = {
      assignee: users[assigneIndex],
      task,
      type: isPrivate ? 'PRIVATE' : 'MUTUAL',
    };

    onPress(taskData);
  };

  const getMiddleRow = () => (
    <View style={styles.buttonRow}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
            setIsPrivate(true);
          }}
          activeOpacity={0.8}
          style={isPrivate ? styles.activeButton : styles.inactiveButton}
        >
          <Icon
            name="md-person-circle-outline"
            size={22}
            color={isPrivate ? COLORS.shades[0] : COLORS.shades[100]}
          />
          <Body
            style={{ marginLeft: 6 }}
            text={i18n.t('Private')}
            color={isPrivate ? COLORS.shades[0] : COLORS.shades[100]}
            type={1}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsPrivate(false);
          }}
          activeOpacity={0.8}
          style={[!isPrivate ? styles.activeButton : styles.inactiveButton, { marginLeft: 6 }]}
        >
          <Icon
            name="ios-people-outline"
            size={22}
            color={!isPrivate ? COLORS.shades[0] : COLORS.shades[100]}
          />
          <Body
            style={{ marginLeft: 6 }}
            color={!isPrivate ? COLORS.shades[0] : COLORS.shades[100]}
            text={i18n.t('Mutual')}
            type={1}
          />
        </TouchableOpacity>
      </View>
      <Icon
        onPress={handlePress}
        name="arrow-up-circle"
        suppressHighlighting
        size={30}
        color={task.length > 0 ? COLORS.primary[700] : COLORS.neutral[100]}
      />
    </View>
  );

  const getAssigneeRow = () => (
    <Animated.View style={[styles.assigneeRow, { transform: [{ translateY }] }]}>
      <Subtitle
        text={i18n.t('Assignee')}
        color={COLORS.neutral[300]}
        style={{ marginLeft: PADDING.xl, marginBottom: 12 }}
      />
      <ScrollView horizontal style={{ paddingLeft: PADDING.m }}>
        {users.map((invitee, index) => {
          const isActive = assigneIndex === index;
          return (
            <TouchableOpacity
              onPress={() => setAssigneIndex(index)}
              activeOpacity={0.9}
              style={{ alignItems: 'center', width: 70 }}
            >
              <View>
                <Avatar
                  size={50}
                  disabled
                  data={invitee}
                />
                {isActive && (
                <View style={styles.avatarOverlay}>
                  <Icon
                    name="checkmark-circle-outline"
                    size={26}
                    color={COLORS.shades[0]}
                  />
                </View>
                )}
              </View>
              <Body
                type={2}
                text={invitee.firstName}
                style={{ fontWeight: isActive ? '500' : '400', marginTop: 4 }}
                color={isActive ? COLORS.shades[100] : COLORS.neutral[300]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );

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
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', flex: 1 }}
      >
        <KeyboardView ignoreTouch>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: animatedBottom }] }]}>
            <View style={styles.innerContainer}>
              <TextInput
                autoFocus
                onChangeText={(val) => setTask(val)}
                style={styles.textInput}
                placeholderTextColor={COLORS.neutral[100]}
                placeholder={i18n.t('Add a task')}
              />
              <Divider style={{ marginTop: PADDING.m }} />
              {getMiddleRow()}
              {!isPrivate && getAssigneeRow()}
            </View>
          </Animated.View>
        </KeyboardView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    maxHeight: '90%',
    marginTop: 'auto',
    borderTopEndRadius: RADIUS.s,
    borderTopStartRadius: RADIUS.s,
    shadowOffset: {
      height: -10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.05,
    shadowColor: COLORS.shades[100],
  },
  buttonRow: {
    marginHorizontal: PADDING.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assigneeRow: {
    marginTop: PADDING.l,
  },
  activeButton: {
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: COLORS.primary[700],
    borderRadius: RADIUS.s,
    flexDirection: 'row',
  },
  inactiveButton: {
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    flexDirection: 'row',
  },
  textInput: {
    marginTop: PADDING.l,
    marginLeft: PADDING.xl,
    letterSpacing: -1,
    fontFamily: 'WorkSans-Regular',
    color: COLORS.shades[100],
    fontSize: 20,
  },
  innerContainer: {
    borderTopRightRadius: RADIUS.s,
    borderTopLeftRadius: RADIUS.s,
    backgroundColor: COLORS.shades[0],
    paddingBottom: 120,
  },
  avatarOverlay: {
    position: 'absolute',
    backgroundColor: Utils.addAlpha(COLORS.shades[100], 0.5),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    flex: 1,
  },
});
