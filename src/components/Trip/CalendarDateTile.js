import { View, StyleSheet } from 'react-native';
import React from 'react';
import Headline from '../typography/Headline';
import COLORS, { RADIUS } from '../../constants/Theme';
import Body from '../typography/Body';
import Utils from '../../utils';

export default function CalendarDateTile({
  style, date, opacity,
}) {
  const backgroundColor = !opacity ? COLORS.neutral[50] : Utils.addAlpha(COLORS.primary[700], opacity);
  const color = !opacity ? COLORS.shades[100] : COLORS.shades[0];

  return (
    <View style={[style, styles.container]}>
      <View style={[styles.bubble, { backgroundColor }]}>
        <Headline
          type={4}
          text={date.dayDate}
          color={color}
        />
      </View>
      <Body
        type={2}
        text={date.dayString}
        color={COLORS.neutral[300]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bubble: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primary[700],
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
});