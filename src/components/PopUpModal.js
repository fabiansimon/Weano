import {
  Modal, StyleSheet, TouchableOpacity,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Animated from 'react-native-reanimated';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';
import Body from './typography/Body';

export default function PopUpModal({
  style, isVisible, onRequestClose, title, subtitle, children,
}) {
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
      visible={isVisible}
      useNativeDriver
      collapsable
      transparent
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onRequestClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.content, style]}
        >
          <Headline type={2} text={title} />
          <Body text={subtitle} color={COLORS.neutral[900]} />
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    width: '90%',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 14,
    alignSelf: 'center',
    backgroundColor: COLORS.shades[0],
  },
});
