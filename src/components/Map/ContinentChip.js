import { StyleSheet, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';
import Subtitle from '../typography/Subtitle';

export default function ContinentChip({
  style, isActive, data, onPress,
}) {
  const color = isActive ? COLORS.shades[0] : COLORS.shades[100];
  const iconBg = isActive ? COLORS.primary[50] : COLORS.neutral[100];
  const backgroundColor = isActive ? COLORS.primary[700] : COLORS.shades[0];
  const borderColor = isActive ? 'transparent' : COLORS.neutral[100];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style, { backgroundColor, borderColor }]}
      activeOpacity={0.6}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Subtitle
          type={4}
          text={data.icon}
        />
      </View>
      <Headline
        type={4}
        text={data.name}
        color={color}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  iconContainer: {
    marginRight: 6,
    borderRadius: 12,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
