import {
  Modal, StyleSheet, View, TouchableOpacity, ScrollView, Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Headline from './typography/Headline';
import COLORS from '../constants/Theme';

export default function FilterModal({
  isVisible, onRequestClose, data, onPress, selectedIndex,
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
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: animatedBottom }] }]}>
          <View style={styles.modalHeader}>
            <Headline type={2} text={data.title} />
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
            {data.options.map((option, index) => (
              <TouchableOpacity
                style={styles.tile}
                onPress={() => {
                  onRequestClose();
                  setTimeout(() => {
                    onPress(option);
                  }, 350);
                }}
              >
                <Headline type={4} text={option.name} />
                {selectedIndex === index && <MaterialIcon name="check" size={20} />}
              </TouchableOpacity>
            ))}
            <View style={{ height: 150 }} />
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    maxHeight: '90%',
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
    height: 55,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
