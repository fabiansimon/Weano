import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  TextInput,
  StatusBar,
  ScrollView,
  Pressable,
  // FlatList,
  Alert,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import COLORS, {PADDING, RADIUS} from '../../constants/Theme';
import BackButton from '../../components/BackButton';
import Body from '../../components/typography/Body';
import i18n from '../../utils/i18n';
import KeyboardView from '../../components/KeyboardView';
import activeTripStore from '../../stores/ActiveTripStore';
import DaysStatusContainer from '../../components/DaysStatusContainer';
import userStore from '../../stores/UserStore';
import ChatBubble from '../../components/Trip/ChatBubble';
import firestore from '@react-native-firebase/firestore';
import {MenuView} from '@react-native-menu/menu';
import SelectionModal from '../../components/SelectionModal';
import ATTACHMENT_TYPE from '../../constants/Attachments';
import AttachmentContainer from '../../components/Trip/AttachmentContainer';
import {useNavigation} from '@react-navigation/native';
import UPDATE_TRIP from '../../mutations/updateTrip';
import {useMutation} from '@apollo/client';
import LoadingModal from '../../components/LoadingModal';

const MAX_INIT_MESSAGES = 20;

export default function ChatScreen() {
  // MUTATIONS
  const [updateTrip, {loading}] = useMutation(UPDATE_TRIP);

  // STORES
  const {activeMembers, title, dateRange, type, chatRoomId, id} =
    activeTripStore(state => state.activeTrip);
  const updateActiveTrip = activeTripStore(state => state.updateActiveTrip);
  const {id: userId} = userStore(state => state.user);

  // STATE && MISC
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState('');
  const [attVisible, setAttVisible] = useState(null);
  const [attachment, setAttachment] = useState(null);

  const navigation = useNavigation();

  const chatRef = useRef();

  const menuActions = [
    {
      id: ATTACHMENT_TYPE.expense,
      title: i18n.t('Expense'),
    },
    {
      id: ATTACHMENT_TYPE.task,
      title: i18n.t('Task'),
    },
    {
      id: ATTACHMENT_TYPE.poll,
      title: i18n.t('Poll'),
    },
    {
      id: ATTACHMENT_TYPE.document,
      title: i18n.t('Document'),
    },
  ];

  useEffect(() => {
    if (chatRoomId) {
      fetchInitChatData();
      subscribeToCollection();
    }

    if (!chatRoomId) {
      handleCreateRoom();
    }
  }, []);

  useEffect(() => {
    if (chatRoomId) {
      fetchInitChatData();
      subscribeToCollection();
    }
  }, [chatRoomId]);

  const handleCreateRoom = () => {
    Alert.alert(
      i18n.t('Premium Feature'),
      i18n.t(
        'The chat feature is only for premium users. Would you like to upgrade your account?',
      ),
      [
        {
          text: i18n.t('Cancel'),
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
        {
          text: i18n.t('Upgrade'),
          onPress: () => handleUpgrade(),
          style: 'default',
        },
      ],
    );
  };

  const handleUpgrade = () => {
    firestore()
      .collection('tripChats')
      .add({
        createdAt: firestore.FieldValue.serverTimestamp(),
        messages: [],
      })
      .then(async res => {
        const roomId = res._documentPath._parts[1];
        updateActiveTrip({chatRoomId: roomId});
        await updateTrip({
          variables: {
            trip: {
              chatRoomId: roomId,
              tripId: id,
            },
          },
        });
      });
  };

  const handleMenuOption = input => {
    const {event} = input;

    setAttVisible(event);
  };

  const onSnapshotResult = snapshot => {
    const {_data} = snapshot;
    if (_data) {
      setChatData(_data.messages);
      scrollDown();
    }
  };

  const fetchInitChatData = async () => {
    setChatData([]);
    try {
      const res = await firestore()
        .collection('tripChats')
        .doc(chatRoomId)
        .get();

      setChatData(res._data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeToCollection = async () => {
    try {
      firestore()
        .collection('tripChats')
        .doc(chatRoomId)
        .onSnapshot(onSnapshotResult, e => console.log(e.message));
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (message.trim().length <= 0 && !attachment) {
      return;
    }

    try {
      const newMessage = {
        createdAt: new Date(),
        senderId: userId,
        additionalData: attachment
          ? {
              type: attachment.type,
              id: attachment.id,
            }
          : {},
        message: message || '',
      };

      setChatData(prev => [...prev, newMessage]);
      cleanData();
      scrollDown();
      const ref = firestore().collection('tripChats').doc(chatRoomId);

      return ref.update({
        messages: firestore.FieldValue.arrayUnion(newMessage),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cleanData = () => {
    setAttVisible(null);
    setAttachment(null);
    setMessage('');
  };

  const scrollDown = () => {
    // chatRef.current?.scrollToIndex({
    //   index: chatData.length - 1,
    //   animated: true,
    // });
    setTimeout(() => {
      chatRef.current?.scrollTo({
        y: 10000,
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
    <>
      <SafeAreaView style={styles.footerContainer}>
        <View style={styles.inputRow}>
          <View style={styles.textField}>
            <View style={{flexDirection: 'row'}}>
              {!attachment && (
                <MenuView
                  style={{top: 10, marginLeft: 2}}
                  title={i18n.t('Add Attachment')}
                  onPressAction={({nativeEvent}) =>
                    handleMenuOption(nativeEvent)
                  }
                  actions={menuActions}>
                  <EvilIcon
                    name="paperclip"
                    color={COLORS.neutral[500]}
                    size={26}
                  />
                </MenuView>
              )}
              <TextInput
                maxLength={300}
                scr
                style={[styles.textInput, {marginLeft: attachment ? 4 : 0}]}
                selectionColor={COLORS.primary[700]}
                value={message || null}
                multiline
                onChangeText={val => setMessage(val)}
                placeholder={i18n.t('Type a message...')}
                placeholderTextColor={COLORS.neutral[500]}
                onFocus={scrollDown}
              />
            </View>
            {attachment && (
              <AttachmentContainer
                attachment={attachment}
                onClose={() => setAttachment(null)}
              />
            )}
          </View>
          <Pressable
            onPress={sendMessage}
            style={[
              styles.roundButton,
              {
                backgroundColor:
                  message.length > 0 || attachment
                    ? COLORS.primary[700]
                    : COLORS.neutral[50],
              },
            ]}>
            <IonIcon
              name="ios-paper-plane"
              size={18}
              style={{marginLeft: -2, marginTop: 2}}
              color={
                message.length > 0 || attachment
                  ? COLORS.shades[0]
                  : COLORS.neutral[300]
              }
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );

  return (
    <>
      <KeyboardView behavior="padding" paddingBottom={1} ignoreTouch>
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
              {chatData?.map(content => (
                <ChatBubble
                  activeMembers={activeMembers}
                  style={{marginBottom: 10}}
                  content={content}
                  isSelf={userId === content.senderId}
                />
              ))}
            </ScrollView>
            {/* <FlatList
              ref={chatRef}
              style={{
                paddingTop: 10,
                marginBottom: 10,
                flexGrow: 1,
                paddingHorizontal: PADDING.s,
              }}
              data={chatData}
              renderItem={({item, index}) => (
                <ChatBubble
                  activeMembers={activeMembers}
                  style={{marginBottom: 10}}
                  content={item}
                  isSelf={userId === item.senderId}
                />
              )}
            /> */}
          </View>
          {getFooter()}
        </View>
      </KeyboardView>

      <LoadingModal isLoading={loading} showVisual={true} />

      <SelectionModal
        isVisible={attVisible !== null}
        onRequestClose={() => {
          setAttVisible(null);
        }}
        onPress={({type, id, title, subtitle}) => {
          setAttachment({
            type,
            id,
            subtitle,
            title,
          });
        }}
        attachment={attVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.shades[0],
  },
  footerContainer: {
    shadowColor: COLORS.neutral[500],
    shadowRadius: 10,
    shadowOpacity: 0.07,
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
    marginTop: 6,
    maxHeight: 120,
    marginBottom: 12,
    fontFamily: 'WorkSans-Regular',
    letterSpacing: -0.5,
    color: COLORS.shades[100],
  },
  textField: {
    minHeight: 40,
    marginRight: 6,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.neutral[100],
    flex: 1,
    paddingHorizontal: 6,
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
