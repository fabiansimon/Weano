import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import Avatar from '../Avatar';
import Body from '../typography/Body';
import COLORS, {RADIUS} from '../../constants/Theme';
import Utils from '../../utils';
import AttachmentContainer from './AttachmentContainer';
import ATTACHMENT_TYPE from '../../constants/Attachments';
import activeTripStore from '../../stores/ActiveTripStore';
import i18n from '../../utils/i18n';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../../constants/Routes';

const AVATAR_SIZE = 30;

export default function ChatBubble({style, content, isSelf, activeMembers}) {
  // STORES
  const {mutualTasks, expenses, polls, documents} = activeTripStore(
    state => state.activeTrip,
  );

  // STATE && MISC
  const navigation = useNavigation();

  const {senderId, timestamp, message, additionalData} = content;

  const senderData = activeMembers.find(m => m.id === senderId);
  // const dateData = Utils.getDateFromTimestamp(timestamp, 'hh:mm');

  const marginLeft = isSelf ? 'auto' : 0;
  const marginRight = !isSelf ? 'auto' : 0;

  const getAttachmentData = useCallback(() => {
    if (!additionalData.type) {
      return null;
    }

    const {type, id} = additionalData;

    switch (`${type.toLowerCase()}`) {
      case ATTACHMENT_TYPE.expense:
        const expenseIndex = expenses.findIndex(e => e._id === id);
        if (expenseIndex === -1) {
          return;
        }

        const e = expenses[expenseIndex];

        return {
          type: ATTACHMENT_TYPE.expense,
          id: e._id,
          title: `${e.currency} ${e.amount}`,
          subtitle: `${i18n.t('Paid by')} ${
            activeMembers.find(m => m.id === e.paidBy)?.firstName
          } ${i18n.t('for')} ${e.title}`,
          onPress: () => navigation.navigate(ROUTES.expenseScreen),
        };

      case ATTACHMENT_TYPE.poll:
        const pollIndex = polls.findIndex(p => p._id === id);
        if (pollIndex === -1) {
          return;
        }

        const p = polls[pollIndex];

        return {
          type: ATTACHMENT_TYPE.poll,
          id: p._id,
          title: p.title,
          subtitle: `${i18n.t('Created by')} ${
            activeMembers.find(m => m.id === p.creatorId)?.firstName
          }`,
          onPress: () => navigation.navigate(ROUTES.pollScreen),
        };

      case ATTACHMENT_TYPE.document:
        const documentIndex = documents.findIndex(d => d._id === id);
        if (documentIndex === -1) {
          return;
        }
        const d = documents[documentIndex];

        return {
          type: ATTACHMENT_TYPE.document,
          id: d._id,
          title: d.title,
          subtitle: `${i18n.t('Uploaded by')} ${
            activeMembers.find(m => m.id === d.creatorId)?.firstName
          }`,
          onPress: () => navigation.navigate(ROUTES.documentsScreen),
        };

      case ATTACHMENT_TYPE.task:
        const taskIndex = mutualTasks.findIndex(t => t._id === id);
        if (taskIndex === -1) {
          return;
        }

        const t = mutualTasks[taskIndex];

        return {
          type: ATTACHMENT_TYPE.task,
          id: t._id,
          title: t.title,
          isDone: t.isDone,
          subtitle: `${i18n.t('Assigned to')} ${
            activeMembers.find(m => m.id === t.assignee)?.firstName
          }`,
          onPress: () => navigation.navigate(ROUTES.checklistScreen),
        };
    }
  }, [additionalData]);

  const attachmentData = getAttachmentData();

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
        {message && (
          <Body
            color={isSelf ? COLORS.shades[0] : COLORS.shades[100]}
            type={2}
            style={{marginLeft: isSelf ? 'auto' : 0}}
            text={message}
          />
        )}
        {attachmentData && (
          <AttachmentContainer
            onPress={attachmentData.onPress}
            style={{marginTop: 8}}
            attachment={attachmentData}
          />
        )}
      </View>
      {isSelf && <Avatar style={{marginLeft: 4}} size={AVATAR_SIZE} isSelf />}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    maxWidth: '70%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: RADIUS.s,
  },
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});
