import {
  Modal, StyleSheet, View,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS from '../constants/Theme';
import Headline from './typography/Headline';

export default function FilterOption({ style, data }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Headline
          type={4}
          text={data.title}
          style={{ marginRight: 4 }}
          color={COLORS.neutral[500]}
        />
        <Icon
          name="chevron-down"
          size={20}
          color={COLORS.neutral[500]}
        />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={isVisible}
        transparent
        collapsable
        onBackdropPress={() => setIsVisible(false)}
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
          style={{ backgroundColor: 'transparent', height: '100%' }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Headline type={2} text={data.title} />
            </View>
            <View style={{ marginBottom: 50 }}>
              {data.options.map((option) => (
                <TouchableOpacity style={styles.tile}>
                  <Headline type={4} text={option} />
                  <MaterialIcon name="check" size={20} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 12,
    height: 40,
    borderWidth: 1,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
  },
  modalContainer: {
    marginTop: 'auto',
    backgroundColor: 'white',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    shadowOffset: {
      height: -10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.15,
    shadowColor: COLORS.shades[100],
  },
  modalHeader: {
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tile: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
