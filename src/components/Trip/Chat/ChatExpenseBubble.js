import { StyleSheet, View } from 'react-native';
import React from 'react';
import COLORS, { PADDING, RADIUS } from '../../../constants/Theme';
import Body from '../../typography/Body';
import Divider from '../../Divider';
import Headline from '../../typography/Headline';

export default function ChatExpenseBubble({ style, data, sender }) {
  return (
    <View style={[styles.container, style]}>
      <Body
        type={2}
        text={`${sender} added an expense 💸`}
        color={COLORS.neutral[300]}
        style={{ marginVertical: 8 }}
      />
      <Divider omitPadding />
      <View style={{ marginTop: 4, marginBottom: 12 }}>
        <Headline
          type={1}
          text={`$${data.amount}`}
          color={COLORS.shades[100]}
        />
        <Headline
          type={4}
          text={data.description}
          color={COLORS.shades[100]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingHorizontal: PADDING.m,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
  },
});
