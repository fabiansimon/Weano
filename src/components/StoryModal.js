import {
  Modal, StyleSheet, View,
} from 'react-native';
import React from 'react';

export default function StoryModal({ data, isVisible, onRequestClose }) {
  console.log(data);
  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      useNativeDriver
      collapsable
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={{ flex: 1, backgroundColor: 'red' }} />
    </Modal>
  );
}

const styles = StyleSheet.create({});
