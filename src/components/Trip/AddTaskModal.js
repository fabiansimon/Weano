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

export default function AddTaskModal({
  isVisible, onRequestClose, onPress,
}) {
  const [isPrivate, setIsPrivate] = useState(true);
  const [task, setTask] = useState('');
  const [showModal, setShowModal] = useState(isVisible);
  const [assigneIndex, setAssigneIndex] = useState(0);
  const [assigneeData, setAssigneeData] = useState([]);
  const animatedBottom = useRef(new Animated.Value(900)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const duration = 300;

  const mockPersonalData = {
    firstName: 'Blabla',
    lastName: 'Etc',
    uri: 'https://i.pravatar.cc/300',
  };

  const mockInvitees = [
    {
      firstName: 'Fabian',
      lastName: 'Simon',
      uri: 'https://i.pravatar.cc/300',
    },
    {
      firstName: 'Julia',
      lastName: 'Stefan',
      uri: 'https://i.pravatar.cc/300',
    },
    {
      firstName: 'Matthias',
      lastName: 'Misha',
      uri: 'https://i.pravatar.cc/300',
    },
  ];

  useEffect(() => {
    setAssigneeData([mockPersonalData, ...mockInvitees]);
    setIsPrivate(true);
    setAssigneIndex(0);
    toggleModal();
  }, [isVisible]);

  useEffect(() => {
    toggleExpand();
  }, [isPrivate]);

  const toggleExpand = () => {
    if (!isPrivate) {
      Animated.spring(animatedY, {
        toValue: 1,
        duration,
        useNativeDriver: false,

      }).start();
    } else {
      Animated.spring(animatedY, {
        toValue: 0,
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
      assignee: assigneeData[assigneIndex],
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
          activeOpacity={0.5}
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
          activeOpacity={0.5}
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
    <Animated.View style={[styles.assigneeRow, { transform: [{ scaleY: animatedY }] }]}>
      <Subtitle
        text={i18n.t('Assignee')}
        color={COLORS.neutral[300]}
        style={{ marginLeft: PADDING.xl, marginBottom: 12 }}
      />
      <ScrollView horizontal style={{ paddingLeft: PADDING.m }}>
        {assigneeData.map((invitee, index) => {
          const isActive = assigneIndex === index;
          return (
            <TouchableOpacity
              onPress={() => setAssigneIndex(index)}
              activeOpacity={0.9}
              style={{ alignItems: 'center', width: 70 }}
            >
              <Avatar
                disabled
                uri={invitee.uri}
                style={{ marginBottom: 6, borderColor: isActive ? COLORS.primary[700] : COLORS.neutral[300] }}
                borderWidth={isActive ? 2 : 0}
              />
              <Body
                type={2}
                text={index === 0 ? i18n.t('You') : invitee.firstName}
                style={{ fontWeight: isActive ? '500' : '400' }}
                color={isActive ? COLORS.primary[700] : COLORS.neutral[300]}
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
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
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
    borderTopRightRadius: RADIUS.l,
    borderTopLeftRadius: RADIUS.l,
    backgroundColor: COLORS.shades[0],
    paddingBottom: 120,
  },
});
