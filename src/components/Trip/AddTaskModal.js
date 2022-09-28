import {
  Modal, StyleSheet, View, TouchableOpacity, Animated, TextInput,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import KeyboardView from '../KeyboardView';
import Divider from '../Divider';
import i18n from '../../utils/i18n';
import Body from '../typography/Body';

export default function AddTaskModal({
  isVisible, onRequestClose, onPress,
}) {
  const [isPrivate, setIsPrivate] = useState(true);
  const [task, setTask] = useState('');
  const [showModal, setShowModal] = useState(isVisible);
  const animatedBottom = useRef(new Animated.Value(900)).current;
  const duration = 300;

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
                placeholder={i18n.t('Add a task')}
              />
              <Divider style={{ marginTop: PADDING.m }} />
              <View style={styles.buttonRow}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => setIsPrivate(true)}
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
                    onPress={() => setIsPrivate(false)}
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
                  onPress={() => onPress()}
                  name="arrow-up-circle"
                  suppressHighlighting
                  size={30}
                  color={task.length > 0 ? COLORS.primary[700] : COLORS.neutral[100]}
                />
              </View>
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
