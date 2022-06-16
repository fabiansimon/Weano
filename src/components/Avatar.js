import {
  StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import React from 'react';
import COLORS from '../constants/Theme';
import DefaultAvatar from '../../assets/images/default_avatar.png';

export default function Avatar({ uri, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={DefaultAvatar} style={{ height: 55, width: 55, position: 'absolute' }} />
      <Image source={{ uri }} style={{ height: 55, width: 55 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 100,
    height: 55,
    width: 55,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.shades[0],
  },
});
