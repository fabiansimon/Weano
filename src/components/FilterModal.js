import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Headline from './typography/Headline';
import COLORS, {RADIUS} from '../constants/Theme';
import Body from './typography/Body';

export default function FilterModal({
  isVisible,
  onRequestClose,
  data,
  selectedIndex,
}) {
  // STATE & MISC
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
      onRequestClose={onRequestClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onRequestClose}
        style={{backgroundColor: 'rgba(0,0,0,0.6)', flex: 1}}>
        <Animated.View
          style={[
            styles.modalContainer,
            {transform: [{translateY: animatedBottom}]},
          ]}>
          <View style={styles.modalHeader}>
            <Headline type={3} text={data.title} />
          </View>
          <ScrollView contentContainerStyle={{paddingBottom: 0}}>
            {data.options.map((option, index) => (
              <TouchableOpacity
                style={styles.tile}
                disabled={option.notAvailable}
                onPress={() => {
                  onRequestClose();
                  setTimeout(() => {
                    option.onPress(option);
                  }, 350);
                }}>
                <Body
                  type={1}
                  color={
                    option.deleteAction
                      ? COLORS.error[900]
                      : option.notAvailable
                      ? COLORS.neutral[300]
                      : COLORS.shades[100]
                  }
                  text={option.name}
                />
                {selectedIndex && selectedIndex === index && (
                  <MaterialIcon name="check" size={20} />
                )}
                {option.trailing || null}
              </TouchableOpacity>
            ))}
            <View style={{height: 150}} />
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    maxHeight: '95%',
    marginTop: 'auto',
    marginBottom: 20,
    backgroundColor: COLORS.shades[0],
    borderTopEndRadius: RADIUS.m,
    borderTopStartRadius: RADIUS.m,
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
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
