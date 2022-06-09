import { Text } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';

export default function Label({
  type, style, text, color,
}) {
  const fontSize = type === 2 ? 9 : 12;
  const lineHeight = 16;
  const fontWeight = type === 2 ? '400' : '600';
  const fontFamily = 'WorkSans-Regular';
  const textColor = color || COLORS.shades[100];

  return (
    <Text style={[{
      fontSize, fontWeight, fontFamily, lineHeight, color: textColor, letterSpacing: -1,
    }, style]}
    >
      {text}
    </Text>
  );
}
