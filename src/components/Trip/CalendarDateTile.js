import { View } from 'react-native';
import React from 'react';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';

export default function CalendarDateTile({ style, date }) {
  return (
    <View style={[style, { alignItems: 'center' }]}>
      <Headline
        type={4}
        text={date.dayString}
        color={COLORS.neutral[500]}
      />
      <Headline
        type={3}
        text={date.dayDate}
        color={COLORS.neutral[900]}
      />
    </View>
  );
}
