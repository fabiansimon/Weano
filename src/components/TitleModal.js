import {
  Modal, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function TitleModal({
  isVisible, onRequestClose, title, children,
}) {
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      onRequestClose={onRequestClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onRequestClose}>
            <Icon name="close" size={24} />
          </TouchableOpacity>
          <Headline type={3} text={title} />
          <View style={{ width: 24 }} />
        </View>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    height: 65,
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
