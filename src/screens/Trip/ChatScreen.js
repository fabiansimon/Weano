import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import BackButton from '../../components/BackButton';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
import i18n from '../../utils/i18n';
import KeyboardView from '../../components/KeyboardView';
import AttachmentContainer from '../../components/Trip/Chat/AttachmentContainer';
import ATTACHMENTS from '../../constants/Attachments';
import ChatMessageContainer from '../../components/Trip/Chat/ChatMessageContainer';
import AddExpenseModal from '../../components/Trip/AddExpenseModal';
import WIDGETS from '../../constants/ChatWidgets';
import AddPollModal from '../../components/Trip/AddPollModal';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [footerExpanded, setFooterExpanded] = useState(false);
  const [expenseVisible, setExpenseVisible] = useState(false);
  const [pollVisible, setPollVisible] = useState(false);
  const [chatData, setChatData] = useState([]);
  const chatRef = useRef();
  const animatedValues = useSharedValue({height: 0, opacity: 0});
  const duration = 250;

  const attachmentData = [
    {
      string: i18n.t("To-Do's"),
      icon: <MatIcon name="clipboard-check-outline" />,
      onPress: () => sendMessage('WIDGET', WIDGETS.TYPE_CHECKLIST),
      type: ATTACHMENTS.checkList,
    },
    {
      string: i18n.t('Expense'),
      icon: <FontIcon name="dollar" />,
      onPress: () => setExpenseVisible(true),
      type: ATTACHMENTS.expense,
    },
    {
      string: i18n.t('Poll'),
      icon: <MatIcon name="poll" />,
      onPress: () => setPollVisible(true),
      type: ATTACHMENTS.poll,
    },
    {
      string: i18n.t('Timer'),
      icon: <MatIcon name="timer-outline" />,
      type: ATTACHMENTS.countdown,
    },
  ];

  const mockData = [
    {
      timestamp: 1660213218,
      senderData: {
        id: 'fabian',
        name: 'Fabian',
        imageUri: 'https://i.pravatar.cc/300',
        phoneNr: '+436641865358',
        stamps: [],
      },
      messages: [
        {
          type: 'STRING',
          content: 'Heyo test',
        },
        {
          type: 'STRING',
          content: 'Julia siehst das heast 🪑',
        },
      ],
    },
    {
      timestamp: 1660215218,
      senderData: {
        id: 'julia',
        name: 'Julia',
        imageUri: 'https://i.pravatar.cc/300',
        phoneNr: '+436641865358',
        stamps: [],
      },
      messages: [
        {
          type: 'STRING',
          content: 'Fix du hengst 🍣',
        },
      ],
    },
    {
      timestamp: 1660215218,
      senderData: {
        id: 'alex',
        name: 'Alex',
        imageUri: 'https://i.pravatar.cc/300',
        phoneNr: '+436641865358',
        stamps: [],
      },
      messages: [
        {
          type: 'WIDGET',
          content: WIDGETS.TYPE_CHECKLIST,
        },
      ],
    },
    {
      timestamp: 1660215218,
      senderData: {
        id: 'didi',
        name: 'Didi',
        imageUri: 'https://i.pravatar.cc/300',
        phoneNr: '+436641865358',
        stamps: [],
      },
      messages: [
        {
          type: 'WIDGET',
          content: WIDGETS.TYPE_EXPENSE,
          data: {
            amount: 140,
            description: 'For the Airbnb 🏡',
          },
        },
      ],
    },
    {
      timestamp: 1660215218,
      senderData: {
        id: 'pauli',
        name: 'Pauli',
        imageUri: 'https://i.pravatar.cc/300',
        phoneNr: '+436641865358',
        stamps: [],
      },
      messages: [
        {
          type: 'WIDGET',
          content: WIDGETS.TYPE_POLL,
          data: {
            title: 'Paris, Lyon or Marseille? 🇫🇷',
            options: [
              {
                string: 'Paris',
                votes: 5,
              },
              {
                string: 'Lyon',
                votes: 2,
              },
              {
                string: 'Marseille',
                votes: 1,
              },
            ],
          },
        },
      ],
    },
  ];

  useEffect(() => {
    setChatData(mockData);
  }, []);

  const scrollDown = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo({
        y: 1000,
        animated: true,
      });
    }, 100);
  };

  const sendMessage = (type, content, data) => {
    if (type === 'STRING' && message.trim().length === 0) return;

    const newMessage = {
      timestamp: Date.now() / 1000,
      senderData: {
        id: 'fabian',
        name: 'Fabian',
        imageUri: 'https://i.pravatar.cc/300',
      },
      messages: [
        {
          type,
          content,
          data,
        },
      ],
    };

    setChatData(prev => prev.concat(newMessage));
    setMessage('');
    toggleExpand();
    scrollDown();
  };

  const extractPollData = data => {
    const options = [];
    for (let i = 1; i < data.length; i += 1) {
      options.push({
        string: data[i].value,
        votes: 0,
      });
    }

    return {
      title: data[0].value,
      options,
    };
  };

  const animationStyle = useAnimatedStyle(() => ({
    height: !footerExpanded
      ? withTiming(animatedValues.value.height, {
          duration,
        })
      : withSpring(animatedValues.value.height, {
          duration,
          mass: 0.3,
        }),

    opacity: withSpring(animatedValues.value.opacity, {
      duration,
    }),
  }));

  const toggleExpand = val => {
    if (!val) {
      setFooterExpanded(false);
      animatedValues.value = {height: 0, opacity: 0};
      return;
    }

    setFooterExpanded(!footerExpanded);
    animatedValues.value = {
      height: !footerExpanded ? 70 : 0,
      opacity: !footerExpanded ? 1 : 0,
    };
  };

  const getHeader = () => (
    <View style={styles.header}>
      <BackButton />
      <View style={styles.title}>
        <Headline type={3} text="Maturareise 2022" />
        <Body type={2} text="2 members" color={COLORS.neutral[300]} />
      </View>
    </View>
  );

  const getChatContainer = () => (
    <View style={styles.chatContainer}>
      <ScrollView
        ref={chatRef}
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 20,
          paddingHorizontal: PADDING.s,
        }}
        showsVerticalScrollIndicator={false}>
        {chatData.map(item => (
          <ChatMessageContainer data={item} />
        ))}
      </ScrollView>
    </View>
  );

  const getFooter = () => (
    <SafeAreaView style={styles.footerContainer}>
      <Animated.View
        style={[
          styles.attachmentContainer,
          animationStyle,
          {
            borderTopColor: COLORS.neutral[100],
            borderTopWidth: footerExpanded ? 1 : 0,
          },
        ]}>
        <ScrollView
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          paddingHorizontal={PADDING.xl}
          style={{paddingTop: 14}}>
          {attachmentData.map((attachment, index) => (
            <AttachmentContainer
              style={{
                marginRight: index === attachmentData.length - 1 ? 50 : 8,
              }}
              onPress={attachment.onPress}
              data={attachment}
            />
          ))}
        </ScrollView>
      </Animated.View>
      <View style={styles.inputRow}>
        <TouchableOpacity
          onPress={toggleExpand}
          style={{
            height: 40,
            width: 40,
            borderRadius: RADIUS.xl,
            backgroundColor: COLORS.neutral[100],
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {footerExpanded ? (
            <Icon
              name="chevron-down"
              size={40}
              style={{opacity: 0.3, marginTop: -2}}
              color={COLORS.neutral[700]}
            />
          ) : (
            <Icon
              name="paperclip"
              size={32}
              style={{opacity: 0.3}}
              color={COLORS.neutral[700]}
            />
          )}
        </TouchableOpacity>
        <View style={styles.textField}>
          <TextInput
            style={styles.textInput}
            selectionColor={COLORS.primary[700]}
            value={message || null}
            onChangeText={val => setMessage(val)}
            placeholder={i18n.t('Type a message...')}
            placeholderTextColor={COLORS.neutral[300]}
            onFocus={scrollDown}
          />
        </View>
        <TouchableOpacity
          onPress={() => sendMessage('STRING', message)}
          style={styles.roundButton}>
          <IonIcon
            name="ios-paper-plane"
            size={22}
            color={COLORS.neutral[300]}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <>
      <KeyboardView ignoreTouch>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <SafeAreaView style={{backgroundColor: COLORS.shades[0]}}>
            {getHeader()}
          </SafeAreaView>
          {getChatContainer()}
          {getFooter()}
        </View>
      </KeyboardView>

      {/* Add Expense Modal */}
      <AddExpenseModal
        onPress={data => sendMessage('WIDGET', WIDGETS.TYPE_EXPENSE, data)}
        isVisible={expenseVisible}
        onRequestClose={() => setExpenseVisible(false)}
      />
      {/* Add Poll Modal */}
      <AddPollModal
        onPress={data =>
          sendMessage('WIDGET', WIDGETS.TYPE_POLL, extractPollData(data))
        }
        isVisible={pollVisible}
        onRequestClose={() => setPollVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  attachmentContainer: {
    marginHorizontal: -PADDING.m,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  footerContainer: {
    shadowColor: COLORS.neutral[500],
    shadowRadius: 10,
    shadowOpacity: 0.07,
    backgroundColor: COLORS.shades[0],
    paddingHorizontal: PADDING.m,
  },
  inputRow: {
    borderTopColor: COLORS.neutral[100],
    borderTopWidth: 0.5,
    paddingTop: PADDING.s,
    paddingHorizontal: PADDING.s,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    alignItems: 'center',
    bottom: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'WorkSans-Regular',
    color: COLORS.shades[100],
  },
  textField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.l,
    backgroundColor: COLORS.neutral[50],
    height: 40,
    flex: 1,
    paddingHorizontal: 15,
    marginLeft: 8,
  },
  swipeDownButton: {
    position: 'absolute',
    top: -25,
    right: 10,
    shadowColor: COLORS.shades[100],
    shadowOpacity: 0.08,
  },
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.neutral[100],
    backgroundColor: COLORS.shades[0],
    flexDirection: 'row',
    paddingHorizontal: PADDING.s,
    paddingBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chatContainer: {
    flex: 1,
    height: 100,
    backgroundColor: COLORS.neutral[50],
    borderBottomRightRadius: RADIUS.s,
    borderBottomLeftRadius: RADIUS.s,
  },
  roundButton: {
    transform: [{rotate: '45deg'}],
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: RADIUS.xl,
    height: 35,
    marginRight: 6,
    justifyContent: 'center',
    width: 35,
  },
});
