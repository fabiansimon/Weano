import {
  Pressable, StyleSheet, View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import COLORS, { PADDING } from '../constants/Theme';
import Body from './typography/Body';

export default function EmptyDataContainer({
  style, title, subtitle, route,
}) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate(route)}
      style={[styles.emptyContainer, style]}
    >
      <View style={{ flex: 1 }}>
        <Body
          type={2}
          text={title}
          style={{ fontWeight: '500' }}
          color={COLORS.neutral[700]}
        />
        <Body
          type={2}
          text={subtitle}
          color={COLORS.neutral[300]}
        />
      </View>
      <Icon
        name="chevron-small-right"
        size={26}
        color={COLORS.neutral[300]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: PADDING.m,
    padding: 10,
    borderRadius: 14,
    paddingVertical: 10,
    borderColor: COLORS.neutral[100],
    borderWidth: 1,
    backgroundColor: COLORS.shades[0],
  },
});
