import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import COLORS, { PADDING, RADIUS } from '../../../constants/Theme';
import Body from '../../typography/Body';

export default function ChatBubble({
  style, isSender = false, string, index, length,
}) {
  const backgroundColor = isSender ? COLORS.neutral[100] : COLORS.primary[700];
  const fontColor = isSender ? COLORS.neutral[900] : COLORS.shades[0];

  const noRadius = 5;

  const multiple = length > 1;
  const isLast = index === length - 1;
  const isFirst = index === 0;

  const getBorderRadius = () => {
    if (!multiple) {
      if (isSender) {
        return {
          borderTopRightRadius: RADIUS.m,
          borderTopLeftRadius: RADIUS.m,
          borderBottomLeftRadius: RADIUS.m,
          borderBottomRightRadius: noRadius,
        };
      }

      return {
        borderTopRightRadius: RADIUS.m,
        borderTopLeftRadius: RADIUS.m,
        borderBottomLeftRadius: noRadius,
        borderBottomRightRadius: RADIUS.m,
      };
    }

    /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// /// ///

    if (isLast) {
      if (isSender) {
        return {
          borderTopRightRadius: noRadius,
          borderTopLeftRadius: noRadius,
          borderBottomLeftRadius: RADIUS.m,
          borderBottomRightRadius: noRadius,
        };
      }
      return {
        borderTopRightRadius: noRadius,
        borderTopLeftRadius: noRadius,
        borderBottomLeftRadius: noRadius,
        borderBottomRightRadius: RADIUS.m,
      };
    }

    if (isFirst) {
      if (isSender) {
        return {
          borderTopRightRadius: RADIUS.m,
          borderTopLeftRadius: RADIUS.m,
          borderBottomLeftRadius: noRadius,
          borderBottomRightRadius: noRadius,
        };
      }
      return {
        borderTopRightRadius: RADIUS.m,
        borderTopLeftRadius: RADIUS.m,
        borderBottomLeftRadius: noRadius,
        borderBottomRightRadius: noRadius,
      };
    }

    return {
      borderTopRightRadius: noRadius,
      borderTopLeftRadius: noRadius,
      borderBottomLeftRadius: noRadius,
      borderBottomRightRadius: noRadius,
    };
  };

  return (
    <View style={[style, styles.container, {
      backgroundColor,
      borderTopRightRadius: getBorderRadius().borderTopRightRadius,
      borderTopLeftRadius: getBorderRadius().borderTopLeftRadius,
      borderBottomLeftRadius: getBorderRadius().borderBottomLeftRadius,
      borderBottomRightRadius: getBorderRadius().borderBottomRightRadius,
    }]}
    >
      <Body
        type={4}
        color={fontColor}
        text={string}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: PADDING.s,
    marginBottom: 2,
    flex: 0,
    maxWidth: Dimensions.get('window').width * 0.6,
  },
});
