import {Modal, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import COLORS from '../constants/Theme';
import Body from './typography/Body';

export default function PopUpModal({
  style,
  isVisible,
  onRequestClose,
  title,
  subtitle,
  children,
  autoClose = false,
}) {
  useEffect(() => {
    if (isVisible && autoClose) {
      setTimeout(() => {
        onRequestClose();
      }, 4000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      useNativeDriver
      collapsable
      transparent
      onRequestClose={onRequestClose}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onRequestClose}>
        <TouchableOpacity activeOpacity={1} style={[styles.content, style]}>
          <Body
            type={1}
            style={{fontWeight: Platform.OS === 'android' ? '700' : '600'}}
            text={title}
            color={COLORS.shades[100]}
          />
          <Body
            type={2}
            style={{marginTop: 4}}
            text={subtitle}
            color={COLORS.neutral[900]}
          />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 14,
    alignSelf: 'center',
    backgroundColor: COLORS.shades[0],
  },
});
