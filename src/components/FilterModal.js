import {
  Modal, StyleSheet, View, TouchableOpacity,
} from 'react-native';
import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';

export default function FilterModal({
  isVisible, onRequestClose, data, onPress,
}) {
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      transparent
      collapsable
      onBackdropPress={onRequestClose}
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onRequestClose}
        style={{ backgroundColor: 'transparent', height: '100%' }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Headline type={2} text={data.title} />
          </View>
          <View style={{ marginBottom: 50 }}>
            {data.options.map((option) => (
              <TouchableOpacity style={styles.tile} onPress={() => {
                onPress(option); 
                onRequestClose();
              }}>
                <Headline type={4} text={option} />
                <MaterialIcon name="check" size={20} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    marginTop: 'auto',
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    shadowOffset: {
      height: -10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.05,
    shadowColor: COLORS.shades[100],
  },
  modalHeader: {
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tile: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
