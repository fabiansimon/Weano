import {
  Modal, StyleSheet, TouchableOpacity,
} from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';
import Body from './typography/Body';

export default function PopUpModal({
  isVisible, onRequestClose, title, subtitle, children,
}) {
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
        activeOpacity={0.7}
        onPress={onRequestClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.content}
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
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: COLORS.shades[0],
  },
});
