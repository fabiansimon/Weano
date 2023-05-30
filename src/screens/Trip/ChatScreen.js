import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useState, useRef} from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Animated, {useSharedValue} from 'react-native-reanimated';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import BackButton from '../../components/BackButton';
import Headline from '../../components/typography/Headline';
import Body from '../../components/typography/Body';
import i18n from '../../utils/i18n';
import KeyboardView from '../../components/KeyboardView';
import Subtitle from '../../components/typography/Subtitle';
import activeTripStore from '../../stores/ActiveTripStore';
import DaysStatusContainer from '../../components/DaysStatusContainer';
import Avatar from '../../components/Avatar';
import userStore from '../../stores/UserStore';
import ChatBubble from '../../components/Trip/ChatBubble';

export default function ChatScreen() {
  // STORES
  const {activeMembers, title, dateRange, type} = activeTripStore(
    state => state.activeTrip,
  );
  const {id: userId} = userStore(state => state.user);

  // STATE && MISC
  const [chatData, setChatData] = useState([
    {
      senderId: activeMembers[0].id,
      timestamp: 213123213,
      text: 'Hello kösfjöaklsd',
      extraData: null,
    },
    {
      senderId: userId,
      timestamp: 213123213,
      text: 'Hello kösfjöaklsd',
      extraData: null,
    },
    {
      senderId: '1321312321',
      timestamp: 213123213,
      text: 'Hello kösfjöaklsd',
      extraData: null,
    },
  ]);
  const [message, setMessage] = useState('');
  const chatRef = useRef();

  const scrollDown = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo({
        y: 1000,
        animated: true,
      });
    }, 100);
  };

  const getHeader = () => (
    <SafeAreaView>
      <View style={styles.header}>
        <BackButton style={{bottom: -8}} isClear />
        <View style={styles.title}>
          <Body type={1} style={{fontWeight: '500'}} text={title} />
        </View>
        <DaysStatusContainer
          style={{marginBottom: 2}}
          data={{dateRange, type}}
        />
      </View>
    </SafeAreaView>
  );

  const getFooter = () => (
    <SafeAreaView style={styles.footerContainer}>
      <Animated.View
        style={[
          styles.attachmentContainer,
          {
            borderTopColor: COLORS.neutral[100],
            borderTopWidth: 1,
          },
        ]}
      />
      <View style={styles.inputRow}>
        <View style={styles.textField}>
          <TextInput
            style={styles.textInput}
            selectionColor={COLORS.primary[700]}
            value={message || null}
            multiline
            onChangeText={val => setMessage(val)}
            placeholder={i18n.t('Type a message...')}
            placeholderTextColor={COLORS.neutral[500]}
            onFocus={scrollDown}
          />
        </View>
        <Pressable
          style={[
            styles.roundButton,
            {
              backgroundColor:
                message.length > 0 ? COLORS.primary[700] : COLORS.neutral[50],
            },
          ]}>
          <IonIcon
            name="ios-paper-plane"
            size={18}
            style={{marginLeft: -2, marginTop: 2}}
            color={message.length > 0 ? COLORS.shades[0] : COLORS.neutral[300]}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );

  return (
    <>
      <KeyboardView behavior="padding" paddingBottom={0} ignoreTouch>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          {getHeader()}
          <View style={styles.chatContainer}>
            <ScrollView
              ref={chatRef}
              contentContainerStyle={{
                flexGrow: 1,
                paddingVertical: 20,
                paddingHorizontal: PADDING.s,
              }}
              showsVerticalScrollIndicator={false}>
              {chatData.map(c => (
                <ChatBubble
                  activeMembers={activeMembers}
                  style={{marginBottom: 10}}
                  content={c}
                  isSelf={userId === c.senderId}
                />
              ))}
            </ScrollView>
          </View>
          {getFooter()}
        </View>
      </KeyboardView>
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
    alignItems: 'flex-end',
  },
  title: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    alignItems: 'center',
    bottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
    fontWeight: '400',
    letterSpacing: -0.4,
    color: COLORS.shades[100],
  },
  textField: {
    maxHeight: 100,
    paddingTop: 6,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.neutral[100],
    borderRadius: RADIUS.l,
    backgroundColor: COLORS.neutral[50],
    flex: 1,
    marginRight: 6,
    paddingHorizontal: 15,
  },
  header: {
    backgroundColor: COLORS.shades[0],
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.neutral[100],
    flexDirection: 'row',
    paddingHorizontal: PADDING.m,
    justifyContent: 'space-between',
    paddingBottom: 4,
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
    borderRadius: RADIUS.xl,
    height: 35,
    marginRight: 6,
    justifyContent: 'center',
    width: 35,
  },
});
