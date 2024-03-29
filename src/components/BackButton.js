import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import COLORS, {RADIUS} from '../constants/Theme';

export default function BackButton({
  style,
  isClear = false,
  onPress,
  iconColor,
  closeIcon = false,
}) {
  const navigation = useNavigation();

  return isClear ? (
    <Icon
      suppressHighlighting
      name={closeIcon ? 'close' : 'arrowleft'}
      size={22}
      color={iconColor || COLORS.shades[100]}
      style={[{zIndex: 9999, width: 40}, style]}
      onPress={() => (onPress ? onPress() : navigation.goBack())}
    />
  ) : (
    <Pressable
      style={[styles.backButton, style]}
      icon={
        <Icon
          name={closeIcon ? 'close' : 'arrowleft'}
          color={COLORS.shades[100]}
          size={22}
        />
      }
      onPress={() => (onPress ? onPress() : navigation.goBack())}>
      <Icon name="arrowleft" color={COLORS.shades[100]} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    zIndex: 9999,
    marginRight: 10,
    borderWidth: 1,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.shades[0],
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.l,
  },
});
