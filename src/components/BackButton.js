import { StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import Button from './Button';
import COLORS from '../constants/Theme';

export default function BackButton({ style, isClear = false }) {
  const navigation = useNavigation();

  const borderWidth = isClear ? 0 : 1;

  return (
    <Button
      style={[styles.backButton, style, { borderWidth }]}
      backgroundColor={isClear ? 'transparent' : COLORS.shades[0]}
      icon={<Icon name="arrowleft" size={22} />}
      fullWidth={false}
      color={COLORS.neutral[900]}
      onPress={() => navigation.goBack()}
    />
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginRight: 10,
    borderColor: COLORS.neutral[100],
  },
});
