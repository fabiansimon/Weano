import {
  Modal, StyleSheet, View, TouchableOpacity, Animated, TextInput,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import KeyboardView from './KeyboardView';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';

export default function InputModal({
  isVisible, onRequestClose, placeholder, onPress,
}) {
  const [showModal, setShowModal] = useState(isVisible);
  const [input, setInput] = useState('');
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
                onChangeText={(val) => setInput(val)}
                style={styles.textInput}
                placeholderTextColor={COLORS.neutral[100]}
                placeholder={placeholder}
              />
              {input.length >= 1 && (
              <TouchableOpacity
                onPress={() => onPress(input)}
                activeOpacity={0.9}
                style={styles.button}
              >
                <Icon
                  color={COLORS.shades[0]}
                  name="plus"
                  size={22}
                />
              </TouchableOpacity>
              )}
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
    shadowOffset: {
      height: -10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.05,
    shadowColor: COLORS.shades[100],
  },
  button: {
    borderRadius: 100,
    backgroundColor: COLORS.primary[700],
    width: 40,
    height: 40,
    marginBottom: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    marginTop: PADDING.l,
    letterSpacing: -1,
    fontFamily: 'WorkSans-Regular',
    color: COLORS.shades[100],
    fontSize: 20,
  },
  innerContainer: {
    paddingHorizontal: PADDING.l,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: RADIUS.s,
    borderTopLeftRadius: RADIUS.s,
    backgroundColor: COLORS.shades[0],
    paddingBottom: 120,
  },
});
