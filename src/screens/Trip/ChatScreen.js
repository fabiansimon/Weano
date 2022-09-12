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
import React, {
  useState, useEffect, useRef,
} from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import COLORS, { PADDING, RADIUS } from '../../constants/Theme';
import BackButton from '../../components/BackButton';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
import i18n from '../../utils/i18n';
import KeyboardView from '../../components/KeyboardView';
import AttachmentContainer from '../../components/Trip/Chat/AttachmentContainer';
import ATTACHMENTS from '../../constants/Attachments';
import ChatMessageContainer from '../../components/Trip/Chat/ChatMessageContainer';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [footerExpanded, setFooterExpanded] = useState(false);
  const animatedValues = useSharedValue({ height: 0, opacity: 0 });
  const [chatData, setChatData] = useState([]);
  const chatRef = useRef();
  const duration = 250;

  const widgetTypes = {
    TYPE_CHECKLIST: 'TYPE_CHECKLIST',
  };

  const attachmentData = [
    {
      string: i18n.t("To-Do's"),
      icon: <MatIcon name="clipboard-check-outline" />,
      onPress: () => sendMessage('WIDGET', widgetTypes.TYPE_CHECKLIST),
      type: ATTACHMENTS.checkList,
    },
    {
      string: i18n.t('Expense'),
      icon: <FontIcon name="dollar" />,
      type: ATTACHMENTS.expense,
    },
    {
      string: i18n.t('Poll'),
      icon: <MatIcon name="poll" />,
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
        imageUri: 'https://i.pravatar.cc/300',
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
        imageUri: 'https://i.pravatar.cc/300',
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
        imageUri: 'https://i.pravatar.cc/300',
      },
      messages: [
        {
          type: 'WIDGET',
          content: 'TYPE_CHECKLIST',
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

  const sendMessage = (type, content) => {
    if (type === 'STRING' && message.trim().length === 0) return;

    const newMessage = {
      timestamp: Date.now(),
      senderData: {
        id: 'fabian',
        imageUri: 'https://i.pravatar.cc/300',
      },
      messages: [
        {
          type,
          content,
        },
      ],
    };

    setChatData((prev) => prev.concat(newMessage));
    setMessage('');
    toggleExpand();
    scrollDown();
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

  const toggleExpand = (val) => {
    if (!val) {
      setFooterExpanded(false);
      animatedValues.value = { height: 0, opacity: 0 };
      return;
    }

    setFooterExpanded(!footerExpanded);
    animatedValues.value = { height: !footerExpanded ? 70 : 0, opacity: !footerExpanded ? 1 : 0 };
  };

  const getHeader = () => (
    <View style={styles.header}>
      <BackButton />
      <View style={styles.title}>
        <Headline
          type={3}
          text="Maturareise 2022"
        />
        <Body
          type={2}
          text="2 members"
          color={COLORS.neutral[300]}
        />
      </View>
    </View>
  );

  const getChatContainer = () => (
    <View
      style={styles.chatContainer}
    >
      <ScrollView
        ref={chatRef}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 20, paddingHorizontal: PADDING.s }}
        showsVerticalScrollIndicator={false}
      >
        {chatData.map((item) => <ChatMessageContainer data={item} />)}
      </ScrollView>
    </View>
  );

  const getFooter = () => (
    <SafeAreaView style={styles.footerContainer}>
      <Animated.View style={[styles.attachmentContainer, animationStyle, {
        borderTopColor: COLORS.neutral[100],
        borderTopWidth: footerExpanded ? 1 : 0,
      }]}
      >
        {/* <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleExpand}
          style={[styles.roundButton, styles.swipeDownButton]}
        >
          <Icon
            name="chevron-down"
            color={COLORS.shades[0]}
            style={{ marginTop: -2 }}
            size={35}
          />
        </TouchableOpacity> */}
        <ScrollView
          horizontal
          scrollEnabled
          paddingHorizontal={PADDING.xl}
          style={{ paddingTop: 14 }}
        >
          {attachmentData.map((attachment) => (
            <AttachmentContainer
              style={{ marginRight: 8 }}
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
          }}
        >
          <Icon
            name="paperclip"
            size={32}
            style={{ opacity: 0.3 }}
            color={COLORS.neutral[700]}
          />
        </TouchableOpacity>
        <View style={[styles.textField, { marginRight: message.length > 0 ? 8 : 0 }]}>
          <TextInput
            style={styles.textInput}
            selectionColor={COLORS.primary[700]}
            value={message || null}
            onChangeText={(val) => setMessage(val)}
            placeholder={i18n.t('Type a message...')}
            placeholderTextColor={COLORS.neutral[300]}
            onFocus={scrollDown}
          />
        </View>
        {message.length > 0 && (
          <TouchableOpacity
            onPress={() => sendMessage('STRING', message)}
            style={[styles.roundButton, { marginRight: -4 }]}
          >
            <AntIcon
              name="arrowright"
              size={20}
              color={COLORS.shades[0]}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );

  return (
    <KeyboardView ignoreTouch>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <SafeAreaView style={{ backgroundColor: COLORS.shades[0] }}>
          {getHeader()}
        </SafeAreaView>
        {getChatContainer()}
        {getFooter()}
      </View>
    </KeyboardView>
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
    alignItems: 'center',
    backgroundColor: COLORS.primary[700],
    borderRadius: RADIUS.xl,
    height: 35,
    justifyContent: 'center',
    width: 35,
  },
});
