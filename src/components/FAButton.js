import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import COLORS, { PADDING, RADIUS } from '../constants/Theme';
import Headline from './typography/Headline';

export default function FAButton({
  style, onPress, icon, iconSize = 22, string, isLoading = false,
}) {
  return (
    <Pressable
      disabled={isLoading}
      onPress={onPress}
      style={[styles.fab, { paddingHorizontal: string ? PADDING.l : 0 }, style]}
    >
      {isLoading
        ? <ActivityIndicator color={COLORS.shades[0]} />
        : (
          <>
            <Headline
              type={4}
              color={COLORS.shades[0]}
              text={string}
            />
            <Icon
              name={icon}
              color={COLORS.shades[0]}
              size={iconSize}
            />

          </>
        )}

    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    right: PADDING.l,
    height: 55,
    minWidth: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    shadowColor: COLORS.neutral[500],
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: {},
  },
});
