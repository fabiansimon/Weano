import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import ChatBubble from './ChatBubble';
import Avatar from '../../Avatar';
import { PADDING } from '../../../constants/Theme';
import ChecklistContainer from '../ChecklistContainer';
import ChatWidgetContainer from './ChatWidgetContainer';
import ROUTES from '../../../constants/Routes';
import ContactDetailModal from '../../ContactDetailModal';
import ChatExpenseBubble from './ChatExpenseBubble';
import WIDGETS from '../../../constants/ChatWidgets';
import ChatPollBubble from './ChatPollBubble';

export default function ChatMessageContainer({ data }) {
  const [contactData, setContactData] = useState(null);
  const navigation = useNavigation();
  const ownId = 'fabian';

  const isSender = data.senderData.id === ownId;

  const taskData = {
    mutualTasks: [
      {
        title: 'Bring speakers 🎧',
        isDone: false,
        assignee: 'Julia Chovo',
      },
      {
        title: 'Check Clubscene 🎉',
        isDone: false,
        assignee: 'Clembo',
      },
      {
        title: 'Pay for Airbnb',
        isDone: false,
        assignee: 'Jennelie',
      },
    ],
  };

  const getWidget = (message, sender) => {
    switch (message.content) {
      case WIDGETS.TYPE_CHECKLIST:
        return (
          <ChatWidgetContainer
            onPress={() => navigation.push(ROUTES.checklistScreen)}
            content={(
              <ChecklistContainer
                sender={sender}
                data={taskData}
              />
            )}
          />
        );
      case WIDGETS.TYPE_EXPENSE:
        return (
          <ChatWidgetContainer
            onPress={() => navigation.push(ROUTES.checklistScreen)}
            content={(
              <ChatExpenseBubble
                data={message.data}
                sender={sender}
              />
            )}
          />
        );
      case WIDGETS.TYPE_POLL:
        return (
          <ChatWidgetContainer
            onPress={() => navigation.push(ROUTES.checklistScreen)}
            content={(
              <ChatPollBubble
                data={message.data}
                sender={sender}
              />
            )}
          />
        );
      default:
        return <View />;
    }
  };

  return (
    <>
      <View style={[styles.container, { justifyContent: isSender ? 'flex-end' : 'flex-start' }]}>
        {!isSender && (
        <Avatar
          uri={data.senderData.imageUri}
          size={40}
          onPress={() => setContactData(data.senderData)}
        />
        )}
        <View style={{
          marginHorizontal: PADDING.s,
          flex: 1,
          alignItems: isSender ? 'flex-end' : 'flex-start',
        }}
        >
          {data.messages.map((message, index) => {
            if (message.type === 'WIDGET') {
              return getWidget(message, data.senderData.name);
            }
            return (
              <ChatBubble
                index={index}
                length={data.messages.length}
                message={message}
                data={data}
                isSender={isSender}
              />
            );
          })}
        </View>
        {isSender && (
        <Avatar
          uri={data.senderData.imageUri}
          size={40}
          onPress={() => setContactData(data.senderData)}
        />
        )}
      </View>
      <ContactDetailModal
        isVisible={contactData !== null}
        onRequestClose={() => setContactData(null)}
        data={contactData}
      />
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
