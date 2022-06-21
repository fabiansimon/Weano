import { StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import Button from './Button';
import COLORS from '../constants/Theme';

export default function BackButton({ style }) {
  const navigation = useNavigation();

  return (
    <Button
      style={[styles.backButton, style]}
      backgroundColor={COLORS.shades[0]}
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
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});
