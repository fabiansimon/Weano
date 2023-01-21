import { View, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import COLORS, { PADDING } from '../constants/Theme';
import Headline from './typography/Headline';
import Body from './typography/Body';
import DaysContainer from './DaysContainer';
import Utils from '../utils';

export default function RecapCardMini({ data, style, onPress }) {
  const {
    location, description, dateRange, title,
  // eslint-disable-next-line react/destructuring-assignment
  } = data;
  return (
    <Pressable
      style={[styles.miniContainer, styles.boxShadow, style]}
      onPress={onPress}
    >
      <View style={{
        justifyContent: 'center', padding: 6, paddingTop: 2, flex: 1, marginRight: 26,
      }}
      >
        <Headline
          isDense
          type={4}
          text={title}
          numberOfLines={1}
        />
        <Body
          type={2}
          numberOfLines={1}
          text={`${description || location?.placeName || Utils.getDateFromTimestamp(dateRange?.startDate, 'MM YYYY')}`}
          color={COLORS.neutral[300]}
          isDense
        />
      </View>
      <DaysContainer dates={dateRange || null} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  miniContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: COLORS.shades[0],
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    aspectRatio: 3.7,
    height: 75,
    padding: PADDING.s,
  },
});
