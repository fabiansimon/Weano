import { Text } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';

export default function Subtitle({
  type, style, text, color,
}) {
  const fontSize = type === 2 ? 12 : 14;
  const lineHeight = type === 2 ? 16 : 19;
  const fontWeight = type === 2 ? '400' : '500';
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
