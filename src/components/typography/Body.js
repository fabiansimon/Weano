import {Text} from 'react-native';
import React from 'react';
import COLORS from '../../constants/Theme';

export default function Body({type, style, text, color, onPress, ...rest}) {
  const fontSize = type === 2 ? 14 : 16;
  const lineHeight = type === 2 ? 19 : 22;
  const fontWeight = '400';
  const fontFamily = 'WorkSans-Regular';
  const textColor = color || COLORS.shades[100];

  return (
    <Text
      {...rest}
      onPress={onPress}
      suppressHighlighting
      style={[
        {
          fontSize,
          fontWeight,
          fontFamily,
          lineHeight,
          color: textColor,
          letterSpacing: -1,
        },
        style,
      ]}>
      {text}
    </Text>
  );
}
