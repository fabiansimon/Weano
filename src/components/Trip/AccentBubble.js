import {StyleSheet, View} from 'react-native';
import React from 'react';
import Label from '../typography/Label';
import COLORS from '../../constants/Theme';
import Utils from '../../utils';

export default function AccentBubble({style, text, disabled = false}) {
  const backgroundColor = disabled
    ? Utils.addAlpha(COLORS.error[900], 0.3)
    : COLORS.error[900];

  return (
    <View style={[styles.imagesLeftContainer, {backgroundColor}, style]}>
      <Label
        type={1}
        color={COLORS.shades[0]}
        style={{marginRight: -1}}
        // text={isProMember ? '∞' : disabled ? '0' : text}
        text={disabled ? '0' : text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imagesLeftContainer: {
    borderRadius: 100,
    height: 18,
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
