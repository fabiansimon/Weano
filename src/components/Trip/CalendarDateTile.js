import { View } from 'react-native';
import React from 'react';
import Headline from '../typography/Headline';
import COLORS from '../../constants/Theme';
import Body from '../typography/Body';

export default function CalendarDateTile({ style, date }) {
  return (
    <View style={[style, { alignItems: 'center' }]}>
      <Body
        type={2}
        text={date.dayString}
        color={COLORS.neutral[300]}
      />
      <Headline
        type={3}
        text={date.dayDate}
        color={COLORS.neutral[900]}
      />
    </View>
  );
}
