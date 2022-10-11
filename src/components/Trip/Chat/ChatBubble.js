import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import COLORS, { PADDING, RADIUS } from '../../../constants/Theme';
import Body from '../../typography/Body';
import Subtitle from '../../typography/Subtitle';
import Utils from '../../../utils';

export default function ChatBubble({
  style, isSender = false, message, data, index, length,
}) {
  const backgroundColor = isSender ? COLORS.neutral[100] : COLORS.primary[700];
  const fontColor = isSender ? COLORS.neutral[900] : COLORS.shades[0];

  const noRadius = 5;

  console.log(data);

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
    <View style={{ marginBottom: 8 }}>
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
          text={message.content}
        />
      </View>
      <Subtitle
        type={2}
        style={{ marginTop: 2, alignSelf: isSender ? 'flex-end' : 'flex-start' }}
        color={COLORS.neutral[300]}
        text={`${data.senderData.name} • ${Utils.getDateFromTimestamp(data.timestamp, 'HH:mm')}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: PADDING.s,
    maxWidth: Dimensions.get('window').width * 0.6,
  },
});
