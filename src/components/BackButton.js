import { StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import Button from './Button';
import COLORS from '../constants/Theme';

export default function BackButton({ style, isClear = false, onPress }) {
  const navigation = useNavigation();

  return (
    isClear ? (
      <Icon
        suppressHighlighting
        name="arrowleft"
        size={26}
        style={{ zIndex: 9999 }}
        onPress={() => (onPress ? onPress() : navigation.goBack())}
      />
    )
      : (
        <Button
          isSecondary
          style={[style, styles.backButton]}
          backgroundColor={COLORS.shades[0]}
          icon={<Icon name="arrowleft" size={22} />}
          fullWidth={false}
          color={COLORS.neutral[900]}
          onPress={() => (onPress ? onPress() : navigation.goBack())}
        />
      )
  );
}

const styles = StyleSheet.create({
  backButton: {
    zIndex: 9999,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
});
