import { Text } from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';

export default function Headline({
  type, style, text, color,
}) {
  const fontSize = type === 4 ? 18 : type === 3 ? 20 : type === 4 ? 24 : 30;
  const lineHeight = type === 4 ? 22 : type === 3 ? 27 : type === 4 ? 33 : 41;
  const fontWeight = type === 4 ? '400' : type === 3 ? '500' : type === 2 ? '600' : '700';
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
