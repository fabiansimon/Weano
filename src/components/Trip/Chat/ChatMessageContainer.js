import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ChatBubble from './ChatBubble';
import Avatar from '../../Avatar';
import { PADDING } from '../../../constants/Theme';
import ChecklistContainer from '../ChecklistContainer';
import ChatWidgetContainer from './ChatWidgetContainer';
import ROUTES from '../../../constants/Routes';

export default function ChatMessageContainer({ data }) {
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

  const getWidget = (type) => {
    switch (type) {
      case 'TYPE_CHECKLIST':
        return (
          <ChatWidgetContainer
            onPress={() => navigation.push(ROUTES.inviteeScreen)}
            content={(
              <ChecklistContainer
                sender="Fabian"
                data={taskData}
              />
            )}
          />
        );
      default:
        return <View />;
    }
  };

  return (
    <View style={[styles.container, { justifyContent: isSender ? 'flex-end' : 'flex-start' }]}>
      {!isSender && (
      <Avatar
        uri={data.senderData.imageUri}
        size={40}
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
            return getWidget(message.content);
          }
          return (
            <ChatBubble
              index={index}
              length={data.messages.length}
              string={message.content}
              isSender={isSender}
            />
          );
        })}
      </View>
      {isSender && (
      <Avatar
        uri={data.senderData.imageUri}
        size={40}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
