import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import Avatar from '../Avatar';
import Body from '../typography/Body';
import COLORS, {RADIUS} from '../../constants/Theme';
import Label from '../typography/Label';
import Utils from '../../utils';

const AVATAR_SIZE = 30;

export default function ChatBubble({style, content, isSelf, activeMembers}) {
  const {senderId, timestamp, text, extraData} = content;

  const senderData = activeMembers.find(m => m.id === senderId);
  const dateData = Utils.getDateFromTimestamp(timestamp, 'hh:mm');

  const marginLeft = isSelf ? 'auto' : 0;
  const marginRight = !isSelf ? 'auto' : 0;

  return (
    <View style={[styles.container, style, {marginRight, marginLeft}]}>
      {!isSelf && (
        <Avatar style={{marginRight: 4}} size={AVATAR_SIZE} data={senderData} />
      )}
      <View
        style={[
          styles.bubbleContainer,
          {
            backgroundColor: isSelf ? COLORS.primary[700] : COLORS.neutral[100],
          },
        ]}>
        <Body
          color={isSelf ? COLORS.shades[0] : COLORS.shades[100]}
          type={1}
          text={text}
        />
      </View>
      {isSelf && <Avatar style={{marginLeft: 4}} size={AVATAR_SIZE} isSelf />}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: RADIUS.s,
  },
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});
